"use client";

import Link from "next/link";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { getTicketStats } from "@/lib/ticket-store";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

function DashboardContent() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setStats(getTicketStats());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Left Side: Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Welcome back, {user?.name}
            </p>
          </div>

          {/* Right Side: Buttons (Desktop) */}
          <div className="hidden sm:flex gap-3">
            <Link href="/tickets">
              <Button>Manage Tickets</Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>

          {/* Mobile Dropdown Menu */}
          <div className="sm:hidden">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="/tickets">Manage Tickets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto py-12 pt-28 lg:pt-35 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total Tickets",
              value: stats.total,
              color: "text-primary",
              pill: "bg-primary/10 text-primary",
            },
            {
              label: "Open",
              value: stats.open,
              color: "text-status-open",
              pill: "bg-status-open/10 text-status-open",
            },
            {
              label: "In Progress",
              value: stats.inProgress,
              color: "text-status-in-progress",
              pill: "bg-status-in-progress/10 text-status-in-progress",
            },
            {
              label: "Closed",
              value: stats.closed,
              color: "text-status-closed",
              pill: "bg-status-closed/10 text-status-closed",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 shadow"
            >
              <p
                className={`text-xs font-semibold px-3 py-1 rounded-full w-fit p-2 mb-2 ${stat.pill}`}
              >
                {stat.label}
              </p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/tickets/create">
              <Button className="w-full cursor-pointer">
                Create New Ticket
              </Button>
            </Link>
            <Link href="/tickets">
              <Button
                className="w-full hover:bg-background hover:text-black cursor-pointer"
                variant="outline"
              >
                View All Tickets
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20 py-12 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2025 TicketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
