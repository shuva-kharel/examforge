import { Router } from "express";
import { authController } from "./auth.module";
import { authenticateJWT } from "../../common/strategies/jwt.strategy";

const authRoutes = Router();

// Public routes
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/verify/email", authController.verifyEmail);
authRoutes.post("/password/forgot", authController.forgotPassword);
authRoutes.post("/password/reset", authController.resetPassword);
authRoutes.get("/refresh", authController.refreshToken);
authRoutes.post("/resend-verification", authController.resendVerificationEmail);
authRoutes.get("/user/:username", authController.getUserByUsername);
authRoutes.post("/magic-link/send", authController.sendMagicLink);
authRoutes.post("/magic-link/verify", authController.verifyMagicLink);
authRoutes.get("/magic-login", authController.verifyMagicLink); // For direct link access

// Protected routes
authRoutes.post("/logout", authenticateJWT, authController.logout);
authRoutes.get("/profile", authenticateJWT, authController.getProfile);
authRoutes.put("/profile", authenticateJWT, authController.updateProfile);
authRoutes.post(
  "/change-password",
  authenticateJWT,
  authController.changePassword
);

export default authRoutes;
