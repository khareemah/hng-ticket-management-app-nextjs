"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Menu, X } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Input,
} from "@/components/ui";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { createTicket, Ticket } from "@/lib/ticket-store";
import { toast } from "sonner";

const ticketSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(1000, "Description too long"),
  status: z.enum(["open", "in_progress", "closed"]),
  priority: z.enum(["low", "medium", "high"]),
});

type TicketFormData = z.infer<typeof ticketSchema>;

function CreateTicketContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "open",
      priority: "low",
    },
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      createTicket(data as Omit<Ticket, "id" | "createdAt" | "updatedAt">);
      toast.success("Ticket created successfully!");
      router.push("/tickets");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create ticket";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Responsive Header */}
      <header className="fixed top-0 left-0 right-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-card-foreground">
            Create Ticket
          </h1>

          {/* Desktop buttons */}
          <div className="hidden sm:flex gap-3">
            <Link href="/tickets">
              <Button variant="outline">Back</Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>

          {/* Mobile dropdown */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/tickets">Back</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-card/95 backdrop-blur-md transition-all duration-200">
            <div className="px-4 py-3 flex flex-col gap-2">
              <Link href="/tickets" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Back
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-card-foreground mb-2"
              >
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-600 font-semibold text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-card-foreground mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Detailed description of the issue"
                rows={6}
                {...register("description")}
                className={`w-full px-3 py-2 border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.description ? "border-red-500" : "border-border"
                }`}
              />
              {errors.description && (
                <p className="text-red-600 font-semibold text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status & Priority */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-card-foreground mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className={`w-full px-3 py-2 border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.status ? "border-red-500" : "border-border"
                  }`}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                {errors.status && (
                  <p className="text-red-600 font-semibold text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-card-foreground mb-2"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  {...register("priority")}
                  className={`w-full px-3 py-2 border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.priority ? "border-red-500" : "border-border"
                  }`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && (
                  <p className="text-red-600 font-semibold text-sm mt-1">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 flex-wrap">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Ticket"
                )}
              </Button>
              <Link href="/tickets">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20 py-8 sm:py-12 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 TicketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function CreateTicketPage() {
  return (
    <ProtectedRoute>
      <CreateTicketContent />
    </ProtectedRoute>
  );
}
