"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { getTickets, updateTicket, type Ticket } from "@/lib/ticket-store";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Button,
  Input,
} from "@/components/ui";
import { Loader2, Menu } from "lucide-react";

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

function EditTicketContent() {
  const params = useParams();
  const ticketId = params.id as string;
  const router = useRouter();
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "open",
      priority: "low",
    },
  });

  useEffect(() => {
    const tickets = getTickets();
    const found = tickets.find((t) => t.id === ticketId);
    if (found) reset(found);
  }, [ticketId, reset]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateTicket(ticketId, data);
      toast.success("Ticket updated successfully!");
      router.push("/tickets");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update ticket";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/70">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">
            Edit Ticket
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
      </header>

      {/* ✅ Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
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
                {...register("title")}
                placeholder="Brief description of the issue"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">
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
                {...register("description")}
                rows={6}
                placeholder="Detailed description of the issue"
                className={`w-full px-3 py-2 border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.description ? "border-red-500" : "border-border"
                }`}
              />
              {errors.description && (
                <p className="text-red-60 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status & Priority */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-card-foreground mb-2"
                >
                  Status <span className="text-destructive">*</span>
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
                  <p className="text-red-600 text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

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
                  <p className="text-red-600 text-sm mt-1">
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
                    Updating...
                  </div>
                ) : (
                  "Update Ticket"
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

      {/* ✅ Footer */}
      <footer className="border-t border-border bg-secondary/20 py-8 sm:py-12 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 TicketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function EditTicketPage() {
  return (
    <ProtectedRoute>
      <EditTicketContent />
    </ProtectedRoute>
  );
}
