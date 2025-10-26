"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { getTickets, deleteTicket, type Ticket } from "@/lib/ticket-store";
import { useToast } from "@/components/toast";
import { toast } from "sonner";
import { Loader2, Menu, X } from "lucide-react";

function TicketsContent() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<
    "all" | "open" | "in_progress" | "closed"
  >("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const filteredTickets = tickets.filter(
    (t) => filter === "all" || t.status === filter
  );

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (deleteTicket(id)) {
      setTickets(tickets.filter((t) => t.id !== id));
      toast.success("Ticket deleted successfully");
      setIsLoading(false);
      setDeleteConfirm(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-status-open/10 text-status-open";
      case "in_progress":
        return "bg-status-in-progress/10 text-status-in-progress";
      case "closed":
        return "bg-status-closed/10 text-status-closed";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-status-in-progress";
      case "low":
        return "text-status-open";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <header className="border-b border-border bg-white fixed w-full top-0 left-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">Tickets</h1>
            <p className="text-muted-foreground text-sm hidden sm:block">
              Manage all your support tickets
            </p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex gap-2 sm:gap-4">
            <Link href="/tickets/create">
              <Button>Create Ticket</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button
              variant="outline"
              onClick={logout}
              aria-label="Logout from your account"
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-foreground focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t border-border shadow-md">
            <div className="flex flex-col gap-2 px-4 py-4">
              <Link href="/tickets/create" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Create Ticket</Button>
              </Link>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full" variant="outline">
                  Dashboard
                </Button>
              </Link>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto md:py-20  py-12 pt-28 lg:pt-35 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8">
          <h2 className="sr-only">Filter tickets by status</h2>
          <div className="flex gap-2 flex-wrap">
            {(["all", "open", "in_progress", "closed"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  aria-pressed={filter === status}
                  aria-label={`Filter by ${status === "all" ? "all tickets" : status === "in_progress" ? "in progress tickets" : `${status} tickets`}`}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {status === "all"
                    ? "All"
                    : status === "in_progress"
                      ? "In Progress"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              No tickets found
            </p>
            <Link href="/tickets/create">
              <Button>Create your first ticket</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4" role="list">
            {filteredTickets.map((ticket) => (
              <article
                key={ticket.id}
                role="listitem"
                className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 wrap-break-word">
                      {ticket.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base wrap-break-word">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/tickets/${ticket.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`Edit ticket: ${ticket.title}`}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={() => setDeleteConfirm(ticket.id)}
                      aria-label={`Delete ticket: ${ticket.title}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-4 items-center flex-wrap text-xs sm:text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status === "in_progress"
                      ? "In Progress"
                      : ticket.status.charAt(0).toUpperCase() +
                        ticket.status.slice(1)}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-medium ${getPriorityColor(ticket.priority)}`}
                  >
                    {ticket.priority.charAt(0).toUpperCase() +
                      ticket.priority.slice(1)}{" "}
                    Priority
                  </span>
                  <time className="text-xs text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </time>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === ticket.id && (
                  <div
                    className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                    role="alert"
                  >
                    <p className="text-destructive font-medium mb-3">
                      Are you sure you want to delete this ticket?
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => handleDelete(ticket.id)}
                        aria-label={`Confirm deletion of ticket: ${ticket.title}`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Deleting...
                          </div>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
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

export default function TicketsPage() {
  return (
    <ProtectedRoute>
      <TicketsContent />
    </ProtectedRoute>
  );
}
