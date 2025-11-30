import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader, Mail, Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { toast } from "@/hooks/use-toast";
import {
  loginMutationFn,
  resendVerificationEmailMutationFn,
  sendMagicLinkMutationFn,
} from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showMagicLinkSent, setShowMagicLinkSent] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginMutationFn,
  });

  const resendVerificationMutation = useMutation({
    mutationFn: resendVerificationEmailMutationFn,
  });

  const sendMagicLinkMutation = useMutation({
    mutationFn: sendMagicLinkMutationFn,
  });

  const formSchema = z.object({
    login: z.string().trim().min(1, {
      message: "Email or username is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.data?.mfaRequired) {
          navigate(`/verify-mfa?email=${values.login}`);
          return;
        }
        navigate("/home");
      },
      onError: (error: any) => {
        if (error.errorCode === "AUTH_EMAIL_NOT_VERIFIED") {
          setShowResendVerification(true);
          setUserEmail(values.login.includes("@") ? values.login : "");
        }
        toast({
          title: "Error",
          description: error.message || "Login failed",
          variant: "destructive",
        });
      },
    });
  };

  const handleResendVerification = () => {
    if (!userEmail) return;
    resendVerificationMutation.mutate(
      { email: userEmail },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Verification email sent successfully!",
            variant: "default",
          });
          setShowResendVerification(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to send verification email",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSendMagicLink = () => {
    const email = form.getValues().login;
    if (!email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address for magic link",
        variant: "destructive",
      });
      return;
    }

    sendMagicLinkMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          setShowMagicLinkSent(true);
          toast({
            title: "Success",
            description: response.data.message,
            variant: "default",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to send magic link",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <main className="w-full min-h-[590px] h-auto max-w-full pt-10">
      <div className="w-full h-full p-5 rounded-md">
        <Logo />

        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left">
          Log in to ExamForge
        </h1>
        <p className="mb-8 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal">
          Don't have an account?{" "}
          <Link className="text-primary" to="/signup">
            Sign up
          </Link>
          .
        </p>

        {showMagicLinkSent && (
          <div className="mb-4 p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Wand2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-green-800 dark:text-green-300">
                  Magic Link Sent!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Check your email for a magic login link. It will expire in 15
                  minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {showResendVerification && (
          <div className="mb-4 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                  Email not verified
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  Please verify your email address before logging in.
                </p>
                <Button
                  onClick={handleResendVerification}
                  disabled={resendVerificationMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-300 dark:hover:bg-yellow-800"
                >
                  {resendVerificationMutation.isPending ? (
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Resend Verification Email
                </Button>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                    Email or Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com or johndoe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full items-center justify-end">
              <Link
                className="text-sm dark:text-white"
                to={`/forgot-password?email=${form.getValues().login}`}
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              disabled={loginMutation.isPending}
              className="w-full text-[15px] h-[40px] text-white font-semibold"
              type="submit"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mb-6 mt-6 flex items-center justify-center">
          <div
            aria-hidden="true"
            className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
            data-orientation="horizontal"
            role="separator"
          ></div>
          <span className="mx-4 text-xs dark:text-[#f1f7feb5] font-normal">
            OR
          </span>
          <div
            aria-hidden="true"
            className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
            data-orientation="horizontal"
            role="separator"
          ></div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full h-[40px]"
          onClick={handleSendMagicLink}
          disabled={sendMagicLinkMutation.isPending}
        >
          {sendMagicLinkMutation.isPending ? (
            <>
              <Loader className="animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Wand2 className="mr-2" />
              Email magic link
            </>
          )}
        </Button>

        <p className="text-xs dark:text-slate- font-normal mt-7">
          By signing in, you agree to our{" "}
          <a className="text-primary hover:underline" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="text-primary hover:underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
