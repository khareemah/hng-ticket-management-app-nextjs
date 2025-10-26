"use client";

import type React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(30, "Password cannot exceed 30 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await signup(data.email, data.password, data.name);
      toast.success("Account created successfully!");
      router.push("/auth/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      setErrorMsg(message);
      toast.error(message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f1f1f1] flex items-center justify-center p-8">
      <div className="max-w-md w-full border border-border bg-white rounded-[12px] p-6  flex flex-col gap-6">
        <div className="w-full flex flex-col gap-0">
          <h1 className="text-3xl font-bold text-card-foreground">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join TicketFlow and start managing tickets
          </p>
        </div>

        {!!errorMsg && (
          <div className="bg-destructive/10 border border-destructive/20 text-red-500 px-4 py-3 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={
                errors.name
                  ? "border-destructive focus:ring-destructive/30"
                  : ""
              }
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1 font-semibold">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={
                errors.email
                  ? "border-destructive focus:ring-destructive/30"
                  : ""
              }
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1 font-semibold">
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
                  ? "border-destructive focus:ring-destructive/30"
                  : ""
              }
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1 font-semibold">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
