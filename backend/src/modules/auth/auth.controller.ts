import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../../config/http.config";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationEmailSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../../common/validators/auth.validator";
import {
  clearAuthenticationCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
} from "../../common/utils/cookie";
import {
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from "../../common/utils/catch-errors";

// Extend Express Request type to include userId and sessionId
interface AuthenticatedRequest extends Request {
  userId?: string;
  sessionId?: string;
  user?: any;
}

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = registerSchema.parse(req.body);
      const { user } = await this.authService.register(body);
      return res.status(HTTPSTATUS.CREATED).json({
        message: "User registered successfully",
        data: user,
      });
    }
  );

  public login = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const userAgent = req.headers["user-agent"];
      const body = loginSchema.parse({
        ...req.body,
        userAgent,
      });

      const { user, accessToken, refreshToken, mfaRequired } =
        await this.authService.login(body);

      if (mfaRequired) {
        return res.status(HTTPSTATUS.OK).json({
          message: "Verify MFA authentication",
          mfaRequired,
          user,
        });
      }

      return setAuthenticationCookies({
        res,
        accessToken,
        refreshToken,
      })
        .status(HTTPSTATUS.OK)
        .json({
          message: "User login successfully",
          mfaRequired,
          user,
        });
    }
  );

  public refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const refreshToken = req.cookies.refreshToken as string | undefined;
      if (!refreshToken) {
        throw new UnauthorizedException("Missing refresh token");
      }

      const { accessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      if (newRefreshToken) {
        res.cookie(
          "refreshToken",
          newRefreshToken,
          getRefreshTokenCookieOptions()
        );
      }

      return res
        .status(HTTPSTATUS.OK)
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .json({
          message: "Refresh access token successfully",
        });
    }
  );

  public verifyEmail = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { code } = verificationEmailSchema.parse(req.body);
      await this.authService.verifyEmail(code);

      return res.status(HTTPSTATUS.OK).json({
        message: "Email verified successfully",
      });
    }
  );

  public forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { email } = req.body;
      const validatedEmail = emailSchema.parse(email);
      await this.authService.forgotPassword(validatedEmail);

      return res.status(HTTPSTATUS.OK).json({
        message: "Password reset email sent",
      });
    }
  );

  public resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = resetPasswordSchema.parse(req.body);
      await this.authService.resetPassword(body);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "Reset Password successfully",
      });
    }
  );

  public logout = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const sessionId = req.sessionId;
      if (!sessionId) {
        throw new NotFoundException("Session is invalid.");
      }
      await this.authService.logout(sessionId);
      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "User logout successfully",
      });
    }
  );

  public resendVerificationEmail = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { email } = req.body;
      const validatedEmail = emailSchema.parse(email);
      await this.authService.resendVerificationEmail(validatedEmail);
      return res.status(HTTPSTATUS.OK).json({
        message: "Verification email sent successfully",
      });
    }
  );

  public getProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const userId = req.userId;

      if (!userId) {
        throw new UnauthorizedException("User not authenticated");
      }

      const { user } = await this.authService.getProfile(userId);

      if (!user) {
        throw new NotFoundException("User not found");
      }

      return res.status(HTTPSTATUS.OK).json({
        message: "Profile retrieved successfully",
        data: user,
      });
    }
  );

  public updateProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const userId = req.userId;

      if (!userId) {
        throw new UnauthorizedException("User not authenticated");
      }

      const body = updateProfileSchema.parse(req.body);
      const { user } = await this.authService.updateProfile(userId, body);

      return res.status(HTTPSTATUS.OK).json({
        message: "Profile updated successfully",
        data: user,
      });
    }
  );

  public changePassword = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const userId = req.userId;

      if (!userId) {
        throw new UnauthorizedException("User not authenticated");
      }

      const body = changePasswordSchema.parse(req.body);
      await this.authService.changePassword(userId, body);

      return res.status(HTTPSTATUS.OK).json({
        message: "Password changed successfully",
      });
    }
  );

  public getUserByUsername = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const { username } = req.params;
      const { user } = await this.authService.getUserByUsername(username);

      if (!user) {
        throw new NotFoundException("User not found");
      }

      return res.status(HTTPSTATUS.OK).json({
        message: "User retrieved successfully",
        data: user,
      });
    }
  );
}
