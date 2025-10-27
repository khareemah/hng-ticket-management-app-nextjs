import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { WaveHero } from "./wave-hero";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Manage Your Tickets Effortlessly
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              TicketFlow is a modern ticket management system designed to
              streamline your workflow and boost productivity.
            </p>
            <div className="flex gap-4">
              <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"}>
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative circle */}
          <div className="relative h-96 hidden md:block">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <WaveHero />
      </div>
    </section>
  );
}
