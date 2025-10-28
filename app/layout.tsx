import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui";

export const metadata: Metadata = {
  title: "TicketFlow - Ticket Management System",
  description: "Manage your tickets efficiently with TicketFlow",
  generator: "v0.app",
};

// Load fonts
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" duration={2000} />
        </AuthProvider>
      </body>
    </html>
  );
}
