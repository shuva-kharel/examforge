"use client";

import { AuthContext, AuthContextType } from "./auth-context";
import useAuth from "@/hooks/use-auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, error, isLoading, isFetching, refetch } = useAuth();
  const user = data?.data?.user;

  const value: AuthContextType = {
    user,
    error,
    isLoading,
    isFetching,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Remove the useAuthContext export from this file
