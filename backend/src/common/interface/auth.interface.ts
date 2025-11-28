import { UserRole } from "../../database/models/user.model"; // Adjust path as needed

export interface RegisterDto {
  name: string;
  username: string; // Added
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole; // Added
  userAgent?: string;
}

export interface LoginDto {
  login: string; // Changed from email to login (can be email or username)
  password: string;
  userAgent?: string;
}

export interface resetPasswordDto {
  password: string;
  verificationCode: string;
}

// New interfaces for additional features
export interface UpdateProfileDto {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
