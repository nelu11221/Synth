import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Synth — AI Agents Platform",
  description: "Build your AI team with specialized agents. Working 24/7.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
