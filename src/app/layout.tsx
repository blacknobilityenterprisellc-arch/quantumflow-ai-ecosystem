import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuantumFlow AI Ecosystem - Advanced AI Platform",
  description: "Experience the next generation of AI-powered applications with QuantumFlow. Build, scale, and deploy intelligent solutions with unprecedented speed and reliability.",
  keywords: ["QuantumFlow", "AI", "Artificial Intelligence", "Machine Learning", "Next.js", "TypeScript", "Enterprise AI", "Chat API", "Image Generation"],
  authors: [{ name: "QuantumFlow AI Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "QuantumFlow AI Ecosystem",
    description: "The future of AI intelligence - Comprehensive platform for building intelligent applications",
    url: "https://quantumflow.ai",
    siteName: "QuantumFlow AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantumFlow AI Ecosystem",
    description: "Advanced AI platform for building intelligent applications at scale",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
          {children}
          <Toaster />
          <SonnerToaster />
        </body>
      </html>
    </SessionProvider>
  );
}
