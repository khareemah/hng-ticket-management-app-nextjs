"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  showToggle?: boolean; // 👈 optional toggle visibility
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showToggle = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordType = type === "password";

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={
            isPasswordType && showToggle
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          data-slot="input"
          className={cn(
            "w-full rounded-sm border border-border bg-background px-4 py-2 text-sm",
            "shadow-none transition-all duration-150 outline-none",
            "focus:border-primary focus:ring-2 focus:ring-primary/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:text-foreground placeholder:text-muted-foreground h-11",
            "dark:bg-input/30",
            showToggle ? "pr-10" : "",
            className
          )}
          {...props}
        />

        {/* 👁 Toggle icon (only for password fields) */}
        {isPasswordType && showToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
