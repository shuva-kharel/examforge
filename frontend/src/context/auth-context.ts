/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

export type UserType = {
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  userPreferences: {
    enable2FA: boolean;
  };
};

// Define the context shape
export type AuthContextType = {
  user?: UserType;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
