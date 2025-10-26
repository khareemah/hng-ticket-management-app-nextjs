"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await login(data.email, data.password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setErrorMsg(message);
      toast.error(message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f1f1f1] flex items-center justify-center p-8">
      <div className="max-w-md w-full border border-border bg-white rounded-[12px] p-6  flex flex-col gap-6">
        <div className="w-full flex flex-col gap-0">
          <h1 className="text-3xl font-bold text-card-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your TicketFlow account
          </p>
        </div>

        {!!errorMsg && (
          <div className="bg-destructive/10 border border-destructive/20 text-red-500 px-4 py-3 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-600 text-sm  font-semibold mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <Input
              type="password"
              showToggle
              {...register("password")}
              className={
                errors.password
                  ? "border-red-500 focus:ring-destructive/30 "
                  : ""
              }
            />

            {errors.password && (
              <p className="text-red-600 text-sm font-semibold mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>

        <div className="mt-2 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3 font-medium">
            Demo Credentials:
          </p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              Email:{" "}
              <code className="bg-secondary px-2 py-1 rounded">
                test@example.com
              </code>
            </p>
            <p>
              Password:{" "}
              <code className="bg-secondary px-2 py-1 rounded">
                password123
              </code>
            </p>
          </div>
        </div>
      </div>
      {/* <div
        className="w-full max-w-md"
        style={{ border: "3px solid red" }}
      ></div> */}
    </div>
  );
}
