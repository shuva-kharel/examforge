import { useState } from "react";
import { ArrowRight, Loader, MailCheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { toast } from "@/hooks/use-toast";
import { registerMutationFn } from "@/lib/api";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });

  const formSchema = z
    .object({
      name: z.string().trim().min(1, {
        message: "Name is required",
      }),
      username: z
        .string()
        .trim()
        .min(3, {
          message: "Username must be at least 3 characters",
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
          message:
            "Username can only contain letters, numbers, and underscores",
        }),
      email: z.string().trim().email().min(1, {
        message: "Email is required",
      }),
      password: z.string().trim().min(6, {
        message: "Password must be at least 6 characters",
      }),
      confirmPassword: z.string().trim().min(1, {
        message: "Confirm Password is required",
      }),
      role: z.enum(["student", "teacher"]).default("student"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password does not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error: any) => {
        console.log(error);
        toast({
          title: "Error",
          description: error.message || "Registration failed",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <main className="w-full min-h-[590px] h-auto max-w-full pt-10">
      {!isSubmitted ? (
        <div className="w-full p-5 rounded-md">
          <Logo />

          <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left">
            Create a ExamForge account
          </h1>
          <p className="mb-5 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal">
            Already have an account?{" "}
            <Link className="text-primary" to="/login">
              Sign in
            </Link>
            .
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Account Type
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                      </select>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Confirm Password
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

              <Button
                disabled={isPending}
                className="w-full text-[15px] h-[40px] !bg-blue-500 text-white font-semibold"
                type="submit"
              >
                {isPending ? (
                  <>
                    <Loader className="animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mb-3 mt-4 flex items-center justify-center">
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

          <Button variant="outline" className="w-full h-[40px]">
            Email magic link
          </Button>

          <p className="text-xs font-normal mt-4">
            By signing up, you agree to our{" "}
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
      ) : (
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <div className="size-[48px]">
            <MailCheckIcon size="48px" className="animate-bounce" />
          </div>
          <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
            Check your email
          </h2>
          <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            We just sent a verification link to {form.getValues().email}.
          </p>
          <Link to="/login">
            <Button className="h-[40px]">
              Go to login
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
