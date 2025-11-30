import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { verifyMagicLinkMutationFn } from "@/lib/api";
import Logo from "@/components/logo";

export default function MagicLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const verifyMagicLink = useMutation({
    mutationFn: verifyMagicLinkMutationFn,
    onSuccess: (response) => {
      setStatus("success");
      toast({
        title: "Success",
        description: "Login successful!",
        variant: "default",
      });
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    },
    onError: (error: any) => {
      setStatus("error");
      toast({
        title: "Error",
        description: error.message || "Invalid or expired magic link",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (token) {
      verifyMagicLink.mutate({ token });
    } else {
      setStatus("error");
      toast({
        title: "Error",
        description: "Invalid magic link",
        variant: "destructive",
      });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Logo />
          <CardTitle className="text-2xl font-bold">Magic Link Login</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader className="h-12 w-12 animate-spin mx-auto text-blue-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Verifying your magic link...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <p className="text-green-600 dark:text-green-400 font-medium">
                Login successful!
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Redirecting you to the dashboard...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 mx-auto text-red-500" />
              <p className="text-red-600 dark:text-red-400 font-medium">
                Invalid or expired magic link
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Please request a new magic link from the login page.
              </p>
              <Button onClick={() => navigate("/login")} className="w-full">
                Go to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
