import API from "./axios-client";

// Updated types
type loginType = {
  login: string; // Changed from 'email' to 'login'
  password: string;
};

type registerType = {
  name: string;
  username: string; // Added username
  email: string;
  password: string;
  confirmPassword: string;
  role?: string; // Added optional role
};

type sendMagicLinkType = { email: string };
type verifyMagicLinkType = { token: string };

type verifyEmailType = { code: string };
type forgotPasswordType = { email: string };
type resetPasswordType = { password: string; verificationCode: string };
type verifyMFAType = { code: string; secretKey: string };
type mfaLoginType = { code: string; email: string };
type SessionType = {
  _id: string;
  userId: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

type SessionResponseType = {
  message: string;
  sessions: SessionType[];
};

type mfaType = {
  message: string;
  secret: string;
  qrImageUrl: string;
};

// Profile management types
type updateProfileType = {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: string;
};

type changePasswordType = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type userProfileType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  profile: {
    bio?: string;
    avatar?: string;
    website?: string;
    location?: string;
  };
  userPreferences: {
    enable2FA: boolean;
    emailNotification: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

// Auth APIs
export const loginMutationFn = async (data: loginType) =>
  await API.post(`/auth/login`, data);

export const registerMutationFn = async (data: registerType) =>
  await API.post(`/auth/register`, data);

export const verifyEmailMutationFn = async (data: verifyEmailType) =>
  await API.post(`/auth/verify/email`, data);

export const forgotPasswordMutationFn = async (data: forgotPasswordType) =>
  await API.post(`/auth/password/forgot`, data);

export const resetPasswordMutationFn = async (data: resetPasswordType) =>
  await API.post(`/auth/password/reset`, data);

export const logoutMutationFn = async () => await API.post(`/auth/logout`);

// MFA APIs
export const verifyMFAMutationFn = async (data: verifyMFAType) =>
  await API.post(`/mfa/verify`, data);

export const verifyMFALoginMutationFn = async (data: mfaLoginType) =>
  await API.post(`/mfa/verify-login`, data);

export const mfaSetupQueryFn = async () => {
  const response = await API.get<mfaType>(`/mfa/setup`);
  return response.data;
};

export const revokeMFAMutationFn = async () => await API.put(`/mfa/revoke`, {});

// Session APIs
export const getUserSessionQueryFn = async () => await API.get(`/session/`);

export const sessionsQueryFn = async () => {
  const response = await API.get<SessionResponseType>(`/session/all`);
  return response.data;
};

export const sessionDelMutationFn = async (id: string) =>
  await API.delete(`/session/${id}`);

// Profile Management APIs
export const getProfileQueryFn = async () => {
  const response = await API.get<{ data: userProfileType }>(`/auth/profile`);
  return response.data;
};

export const updateProfileMutationFn = async (data: updateProfileType) =>
  await API.put(`/auth/profile`, data);

export const changePasswordMutationFn = async (data: changePasswordType) =>
  await API.post(`/auth/change-password`, data);

export const getUserByUsernameQueryFn = async (username: string) => {
  const response = await API.get<{ data: userProfileType }>(
    `/auth/user/${username}`
  );
  return response.data;
};

export const resendVerificationEmailMutationFn = async (
  data: forgotPasswordType
) => await API.post(`/auth/resend-verification`, data);

export const sendMagicLinkMutationFn = async (data: sendMagicLinkType) =>
  await API.post(`/auth/magic-link/send`, data);

export const verifyMagicLinkMutationFn = async (data: verifyMagicLinkType) =>
  await API.post(`/auth/magic-link/verify`, data);
