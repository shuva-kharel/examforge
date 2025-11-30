import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import {
  LoginDto,
  RegisterDto,
  resetPasswordDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from "../../common/interface/auth.interface";
import { UserRole } from "../../database/models/user.model";
import {
  BadRequestException,
  HttpException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import {
  anHourFromNow,
  calculateExpirationDate,
  fortyFiveMinutesFromNow,
  ONE_DAY_IN_MS,
  threeMinutesAgo,
} from "../../common/utils/date-time";
import SessionModel from "../../database/models/session.model";
import UserModel from "../../database/models/user.model";
import VerificationCodeModel from "../../database/models/verification.model";
import { config } from "../../config/app.config";
import {
  refreshTokenSignOptions,
  RefreshTPayload,
  signJwtToken,
  verifyJwtToken,
} from "../../common/utils/jwt";
import { sendEmail } from "../../mailers/mailer";
import {
  passwordResetTemplate,
  verifyEmailTemplate,
  loginAlertTemplate,
  magicLinkTemplate,
} from "../../mailers/templates/template";
import { HTTPSTATUS } from "../../config/http.config";
import { hashValue } from "../../common/utils/bcrypt";
import { logger } from "../../common/utils/logger";

export class AuthService {
  public async register(registerData: RegisterDto) {
    const { name, username, email, password, confirmPassword, role } =
      registerData;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException(
        "Passwords do not match",
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Prevent admin registration
    if (role === UserRole.ADMIN) {
      throw new BadRequestException(
        "Admin role cannot be assigned during registration",
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Check if email already exists
    const existingEmail = await UserModel.exists({ email });
    if (existingEmail) {
      throw new BadRequestException(
        "User already exists with this email",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    // Check if username already exists
    const existingUsername = await UserModel.exists({
      username: username.toLowerCase(),
    });
    if (existingUsername) {
      throw new BadRequestException(
        "Username is already taken",
        "AUTH_USERNAME_ALREADY_EXISTS" as any
      );
    }

    // Validate role if provided
    if (role && !Object.values(UserRole).includes(role)) {
      throw new BadRequestException(
        "Invalid user role",
        ErrorCode.VALIDATION_ERROR
      );
    }

    const newUser = await UserModel.create({
      name,
      username: username.toLowerCase(),
      email,
      password,
      role: role || UserRole.STUDENT,
    });
    const userId = newUser._id;

    const verification = await VerificationCodeModel.create({
      userId,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: fortyFiveMinutesFromNow(),
    });

    const verificationUrl = `${config.APP_ORIGIN}/confirm-account?code=${verification.code}`;

    const info = await sendEmail({
      to: newUser.email,
      ...verifyEmailTemplate(verificationUrl),
    });

    if (!info.messageId) {
      throw new InternalServerException("Failed to send verification email");
    }

    return { user: newUser };
  }

  public async login(loginData: LoginDto) {
    const { login, password, userAgent } = loginData;

    logger.info(`Login attempt for: ${login}`);

    // Find user by email OR username
    const user = await UserModel.findOne({
      $or: [{ email: login }, { username: login.toLowerCase() }],
    });

    if (!user) {
      logger.warn(`Login failed: User with login ${login} not found`);
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      logger.warn(`Login failed: Email not verified for user: ${login}`);

      // Optionally resend verification email
      const existingVerification = await VerificationCodeModel.findOne({
        userId: user._id,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: { $gt: new Date() },
      });

      let verificationCode;
      if (!existingVerification) {
        verificationCode = await VerificationCodeModel.create({
          userId: user._id,
          type: VerificationEnum.EMAIL_VERIFICATION,
          expiresAt: fortyFiveMinutesFromNow(),
        });
      } else {
        verificationCode = existingVerification;
      }

      const verificationUrl = `${config.APP_ORIGIN}/confirm-account?code=${verificationCode.code}`;

      await sendEmail({
        to: user.email,
        ...verifyEmailTemplate(verificationUrl),
      });

      throw new BadRequestException(
        "Please verify your email address before logging in. A new verification email has been sent.",
        "AUTH_EMAIL_NOT_VERIFIED" as any
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for: ${login}`);
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    if (user.userPreferences.enable2FA) {
      logger.info(`2FA required for user ID: ${user._id}`);
      return {
        user: null,
        mfaRequired: true,
        accessToken: "",
        refreshToken: "",
      };
    }

    logger.info(`Creating session for user ID: ${user._id}`);
    const session = await SessionModel.create({ userId: user._id, userAgent });

    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: session._id,
      role: user.role,
    });
    const refreshToken = signJwtToken(
      { sessionId: session._id },
      refreshTokenSignOptions
    );

    // Send login notification email
    await this.sendLoginNotification(user, userAgent);

    return { user, accessToken, refreshToken, mfaRequired: false };
  }

  public async sendMagicLink(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return {
        message:
          "If an account exists, a magic link has been sent to your email",
      };
    }

    // Generate magic token
    const magicToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store magic token in verification collection
    await VerificationCodeModel.create({
      userId: user._id,
      code: magicToken,
      type: VerificationEnum.MAGIC_LINK,
      expiresAt,
    });

    const magicLink = `${config.APP_ORIGIN}/auth/magic-login?token=${magicToken}`;

    // Send magic link email
    const info = await sendEmail({
      to: user.email,
      ...magicLinkTemplate(user.name, magicLink),
    });

    if (!info.messageId) {
      throw new InternalServerException("Failed to send magic link email");
    }

    logger.info(`Magic link sent to user: ${user.email}`);

    return { message: "Magic link sent to your email" };
  }

  public async verifyMagicLink(token: string, userAgent?: string) {
    const validToken = await VerificationCodeModel.findOne({
      code: token,
      type: VerificationEnum.MAGIC_LINK,
      expiresAt: { $gt: new Date() },
    });

    if (!validToken) {
      throw new BadRequestException("Invalid or expired magic link");
    }

    const user = await UserModel.findById(validToken.userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
      logger.info(`Email auto-verified via magic link for user: ${user.email}`);
    }

    // Create session
    const session = await SessionModel.create({
      userId: user._id,
      userAgent,
    });

    // Generate tokens
    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: session._id,
      role: user.role,
    });
    const refreshToken = signJwtToken(
      { sessionId: session._id },
      refreshTokenSignOptions
    );

    // Delete used magic token
    await validToken.deleteOne();

    // Send login notification email
    await this.sendLoginNotification(user, userAgent);

    logger.info(`Magic link login successful for user: ${user.email}`);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(refreshToken: string) {
    const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (!payload) throw new UnauthorizedException("Invalid refresh token");

    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();
    if (!session) throw new UnauthorizedException("Session does not exist");
    if (session.expiredAt.getTime() <= now)
      throw new UnauthorizedException("Session expired");

    // Check if user's email is still verified when refreshing token
    const user = await UserModel.findById(session.userId);
    if (!user || !user.isEmailVerified) {
      await SessionModel.findByIdAndDelete(payload.sessionId);
      throw new UnauthorizedException("Email verification required");
    }

    const sessionRequireRefresh =
      session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;
    if (sessionRequireRefresh) {
      session.expiredAt = calculateExpirationDate(
        config.JWT.REFRESH_EXPIRES_IN
      );
      await session.save();
    }

    const newRefreshToken = sessionRequireRefresh
      ? signJwtToken({ sessionId: session._id }, refreshTokenSignOptions)
      : undefined;

    const accessToken = signJwtToken({
      userId: session.userId,
      sessionId: session._id,
      role: user.role,
    });

    return { accessToken, newRefreshToken };
  }

  // Profile Management Methods
  public async getProfile(userId: string) {
    const user = await UserModel.findById(userId).select(
      "-password -userPreferences.twoFactorSecret"
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return { user };
  }

  public async updateProfile(userId: string, updateData: UpdateProfileDto) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Update basic fields
    if (updateData.name) user.name = updateData.name;

    // Update profile fields
    user.profile = {
      ...user.profile,
      bio: updateData.bio !== undefined ? updateData.bio : user.profile.bio,
      website:
        updateData.website !== undefined
          ? updateData.website
          : user.profile.website,
      location:
        updateData.location !== undefined
          ? updateData.location
          : user.profile.location,
      avatar:
        updateData.avatar !== undefined
          ? updateData.avatar
          : user.profile.avatar,
    };

    await user.save();

    return { user: user.toJSON() };
  }

  public async changePassword(
    userId: string,
    changePasswordData: ChangePasswordDto
  ) {
    const { currentPassword, newPassword, confirmNewPassword } =
      changePasswordData;

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        "New passwords do not match",
        ErrorCode.VALIDATION_ERROR
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException(
        "Current password is incorrect",
        "AUTH_INVALID_PASSWORD" as any
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Invalidate all existing sessions for security
    await SessionModel.deleteMany({ userId });

    logger.info(`Password changed successfully for user ID: ${userId}`);

    return { message: "Password changed successfully" };
  }

  public async getUserByUsername(username: string) {
    const user = await UserModel.findOne({
      username: username.toLowerCase(),
    }).select("-password -userPreferences.twoFactorSecret");

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return { user };
  }

  public async verifyEmail(code: string) {
    const validCode = await VerificationCodeModel.findOne({
      code,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: { $gt: new Date() },
    });

    if (!validCode)
      throw new BadRequestException("Invalid or expired verification code");

    const updatedUser = await UserModel.findByIdAndUpdate(
      validCode.userId,
      { isEmailVerified: true },
      { new: true }
    );

    if (!updatedUser)
      throw new BadRequestException(
        "Unable to verify email address",
        ErrorCode.VALIDATION_ERROR
      );

    await validCode.deleteOne();

    // Log the successful verification
    logger.info(`Email verified successfully for user ID: ${updatedUser._id}`);

    return { user: updatedUser };
  }

  public async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFoundException("User not found");

    const timeAgo = threeMinutesAgo();
    const maxAttempts = 2;

    const count = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: VerificationEnum.PASSWORD_RESET,
      createdAt: { $gt: timeAgo },
    });

    if (count >= maxAttempts) {
      throw new HttpException(
        "Too many requests, try again later",
        HTTPSTATUS.TOO_MANY_REQUESTS,
        ErrorCode.AUTH_TOO_MANY_ATTEMPTS
      );
    }

    const expiresAt = anHourFromNow();
    const validCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationEnum.PASSWORD_RESET,
      expiresAt,
    });

    const resetLink = `${config.APP_ORIGIN}/reset-password?code=${
      validCode.code
    }&exp=${expiresAt.getTime()}`;

    const info = await sendEmail({
      to: user.email,
      ...passwordResetTemplate(resetLink),
    });

    if (!info.messageId) {
      throw new InternalServerException("Failed to send reset email");
    }

    return { url: resetLink, emailId: info.messageId };
  }

  public async resetPassword({ password, verificationCode }: resetPasswordDto) {
    const validCode = await VerificationCodeModel.findOne({
      code: verificationCode,
      type: VerificationEnum.PASSWORD_RESET,
      expiresAt: { $gt: new Date() },
    });

    if (!validCode)
      throw new NotFoundException("Invalid or expired verification code");

    const hashedPassword = await hashValue(password);

    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
      password: hashedPassword,
    });
    if (!updatedUser)
      throw new BadRequestException("Failed to reset password!");

    await validCode.deleteOne();
    await SessionModel.deleteMany({ userId: updatedUser._id });

    return { user: updatedUser };
  }

  public async logout(sessionId: string) {
    return await SessionModel.findByIdAndDelete(sessionId);
  }

  // Additional method to resend verification email
  public async resendVerificationEmail(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Email is already verified");
    }

    // Delete any existing verification codes
    await VerificationCodeModel.deleteMany({
      userId: user._id,
      type: VerificationEnum.EMAIL_VERIFICATION,
    });

    // Create new verification code
    const verification = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: fortyFiveMinutesFromNow(),
    });

    const verificationUrl = `${config.APP_ORIGIN}/confirm-account?code=${verification.code}`;

    const info = await sendEmail({
      to: user.email,
      ...verifyEmailTemplate(verificationUrl),
    });

    if (!info.messageId) {
      throw new InternalServerException("Failed to send verification email");
    }

    return { message: "Verification email sent successfully" };
  }

  /**
   * Send login notification email to user
   */
  private async sendLoginNotification(
    user: any,
    userAgent: string = "Unknown"
  ) {
    try {
      const loginTime = new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      // Extract device info from user agent
      const deviceInfo = this.extractDeviceInfo(userAgent);

      // For now, we'll use "Unknown" for location
      // In production, you might want to use IP geolocation
      const location = "Unknown";

      const emailTemplate = loginAlertTemplate(
        user.name,
        loginTime,
        deviceInfo,
        location
      );

      const info = await sendEmail({
        to: user.email,
        ...emailTemplate,
      });

      if (!info.messageId) {
        logger.warn(
          `Failed to send login notification email to user: ${user.email}`
        );
      } else {
        logger.info(`Login notification email sent to user: ${user.email}`);
      }
    } catch (error) {
      logger.error(`Error sending login notification email: ${error}`);
      // Don't throw error - login should succeed even if email fails
    }
  }

  /**
   * Extract device information from user agent string
   */
  private extractDeviceInfo(userAgent: string): string {
    if (!userAgent) return "Unknown Device";

    let deviceInfo = "Unknown Device";

    // Browser detection
    if (userAgent.includes("Chrome")) deviceInfo = "Chrome";
    else if (userAgent.includes("Firefox")) deviceInfo = "Firefox";
    else if (userAgent.includes("Safari")) deviceInfo = "Safari";
    else if (userAgent.includes("Edge")) deviceInfo = "Edge";

    // OS detection
    if (userAgent.includes("Windows")) deviceInfo += " on Windows";
    else if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS"))
      deviceInfo += " on macOS";
    else if (userAgent.includes("Linux")) deviceInfo += " on Linux";
    else if (userAgent.includes("Android")) deviceInfo += " on Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      deviceInfo += " on iOS";

    // Mobile detection
    if (userAgent.includes("Mobile")) deviceInfo += " (Mobile)";

    return deviceInfo || "Unknown Device";
  }
}
