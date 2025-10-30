"use client";

import Link from "next/link";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";
import { WaveHero } from "@/components/wave-hero";
import { useAuth } from "@/lib/auth-context";
import { Menu } from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border fixed w-full top-0 left-0 bg-background shadow-sm z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">TicketFlow</div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="hover:bg-background hover:text-black cursor-pointer"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="cursor-pointer">Get Started</Button>
                </Link>
              </>
            )}
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
                  {isAuthenticated ? (
                    <Link href="/dashboard">Dashboard</Link>
                  ) : (
                    <>
                      <DropdownMenuItem>
                        <Link href="/auth/login">Login</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/auth/signup" className="cursor-pointer">
                          Get Started
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-40 md:py-20 overflow-hidden bg-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                Manage Your Tickets Effortlessly
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                TicketFlow is a modern ticket management system designed to
                streamline your workflow and boost productivity.
              </p>

              <div className="flex gap-4">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="relative z-10">
                    <Button className="cursor-pointer">
                      {isAuthenticated ? "Dashboard" : "Get Started"}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" className="relative z-10">
                      <Button
                        variant="outline"
                        className="hover:bg-background w-[120px] hover:text-black cursor-pointer"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="relative z-10">
                      <Button className="cursor-pointer">Get Started</Button>
                    </Link>
                  </>
                )}{" "}
              </div>
            </div>

            {/* Decorative blur circles */}
            <div className="relative h-96 block">
              <div
                className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, #3B82F6aa, #60A5FA66, transparent)",
                }}
              ></div>

              <div
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl"
                style={{
                  background:
                    "linear-gradient(45deg, #60A5FA55, #3B82F633, transparent)",
                }}
              ></div>

              <div
                className="absolute inset-0 m-auto w-40 h-40 rounded-full blur-2xl"
                style={{ backgroundColor: "#3B82F622" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Layered Blue Wave Background */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* First wave */}
            <path
              d="M0,160 Q360,120 720,160 T1440,160 L1440,200 L0,200 Z"
              fill="url(#blueWave1)"
            />
            {/* Second wave */}
            <path
              d="M0,180 Q360,140 720,180 T1440,180 L1440,200 L0,200 Z"
              fill="url(#blueWave2)"
            />
            <defs>
              <linearGradient id="blueWave1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="blueWave2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose TicketFlow?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy to Use",
                description:
                  "Intuitive interface designed for teams of all sizes",
                icon: "✓",
              },
              {
                title: "Real-time Updates",
                description:
                  "Stay synchronized with instant ticket status changes",
                icon: "⚡",
              },
              {
                title: "Secure & Reliable",
                description:
                  "Your data is protected with industry-standard security",
                icon: "🔒",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams using TicketFlow to manage their tickets
            efficiently.
          </p>
          <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"}>
            <Button size="lg">Start Free Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20 py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">
                TicketFlow
              </h3>
              <p className="text-muted-foreground">
                Modern ticket management for teams
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 TicketFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
