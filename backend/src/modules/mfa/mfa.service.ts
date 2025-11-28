import { Request } from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import UserModel from "../../database/models/user.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  InternalServerException,
} from "../../common/utils/catch-errors";
import SessionModel from "../../database/models/session.model";
import { refreshTokenSignOptions, signJwtToken } from "../../common/utils/jwt";
import { sendEmail } from "../../mailers/mailer";
import {
  loginAlertTemplate,
  mfaEnabledTemplate,
  mfaDisabledTemplate,
} from "../../mailers/templates/template";

export class MfaService {
  public async generateMFASetup(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    if (user.userPreferences.enable2FA) {
      return {
        message: "MFA already enabled",
      };
    }

    let secretKey = user.userPreferences.twoFactorSecret;
    if (!secretKey) {
      const secret = speakeasy.generateSecret({ name: "ExamForge" });
      secretKey = secret.base32;
      user.userPreferences.twoFactorSecret = secretKey;
      await user.save();
    }

    const url = speakeasy.otpauthURL({
      secret: secretKey,
      label: `${user.name}`,
      issuer: "ExamForge.com",
      encoding: "base32",
    });

    const qrImageUrl = await qrcode.toDataURL(url);

    return {
      message: "Scan the QR code or use the setup key.",
      secret: secretKey,
      qrImageUrl,
    };
  }

  public async verifyMFASetup(req: Request, code: string, secretKey: string) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    if (user.userPreferences.enable2FA) {
      return {
        message: "MFA is already enabled",
        userPreferences: {
          enable2FA: user.userPreferences.enable2FA,
        },
      };
    }

    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code. Please try again.");
    }

    user.userPreferences.enable2FA = true;
    await user.save();

    // Send MFA enabled notification email
    try {
      const emailTemplate = mfaEnabledTemplate(user.name);
      const info = await sendEmail({
        to: user.email,
        ...emailTemplate,
      });

      if (!info.messageId) {
        console.warn("Failed to send MFA enabled notification email");
      }
    } catch (emailError) {
      console.error("Error sending MFA enabled email:", emailError);
      // Don't throw error - MFA setup should succeed even if email fails
    }

    return {
      message: "MFA setup completed successfully",
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }

  public async revokeMFA(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    if (!user.userPreferences.enable2FA) {
      return {
        message: "MFA is not enabled",
        userPreferences: {
          enable2FA: user.userPreferences.enable2FA,
        },
      };
    }

    user.userPreferences.twoFactorSecret = undefined;
    user.userPreferences.enable2FA = false;
    await user.save();

    // Send MFA disabled notification email
    try {
      const emailTemplate = mfaDisabledTemplate(user.name);
      const info = await sendEmail({
        to: user.email,
        ...emailTemplate,
      });

      if (!info.messageId) {
        console.warn("Failed to send MFA disabled notification email");
      }
    } catch (emailError) {
      console.error("Error sending MFA disabled email:", emailError);
      // Don't throw error - MFA revocation should succeed even if email fails
    }

    return {
      message: "MFA revoke successfully",
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }

  public async verifyMFAForLogin(
    code: string,
    email: string,
    userAgent?: string
  ) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (
      !user.userPreferences.enable2FA &&
      !user.userPreferences.twoFactorSecret
    ) {
      throw new UnauthorizedException("MFA not enabled for this user");
    }

    const isValid = speakeasy.totp.verify({
      secret: user.userPreferences.twoFactorSecret!,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code. Please try again.");
    }

    // Sign access token & refresh token
    const session = await SessionModel.create({
      userId: user._id,
      userAgent,
    });

    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: session._id,
      role: user.role,
    });

    const refreshToken = signJwtToken(
      {
        sessionId: session._id,
      },
      refreshTokenSignOptions
    );

    // Send login notification email for MFA login too
    await this.sendLoginNotification(user, userAgent);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Send login notification email to user (add this method to MfaService too)
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

      const deviceInfo = this.extractDeviceInfo(userAgent);
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
        console.warn(
          `Failed to send login notification email to user: ${user.email}`
        );
      } else {
        console.log(`Login notification email sent to user: ${user.email}`);
      }
    } catch (error) {
      console.error(`Error sending login notification email: ${error}`);
    }
  }

  /**
   * Extract device information from user agent string
   */
  private extractDeviceInfo(userAgent: string): string {
    if (!userAgent) return "Unknown Device";

    let deviceInfo = "Unknown Device";

    if (userAgent.includes("Chrome")) deviceInfo = "Chrome";
    else if (userAgent.includes("Firefox")) deviceInfo = "Firefox";
    else if (userAgent.includes("Safari")) deviceInfo = "Safari";
    else if (userAgent.includes("Edge")) deviceInfo = "Edge";

    if (userAgent.includes("Windows")) deviceInfo += " on Windows";
    else if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS"))
      deviceInfo += " on macOS";
    else if (userAgent.includes("Linux")) deviceInfo += " on Linux";
    else if (userAgent.includes("Android")) deviceInfo += " on Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      deviceInfo += " on iOS";

    if (userAgent.includes("Mobile")) deviceInfo += " (Mobile)";

    return deviceInfo || "Unknown Device";
  }
}
