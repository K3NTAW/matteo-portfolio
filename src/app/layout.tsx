import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GradientMenu from "@/components/ui/gradient-menu";
import PageTitle from "@/components/ui/page-title";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matteo Pianta - Mediamatiker",
  description: "Portfolio von Matteo Pianta, Mediamatiker im 2. Lehrjahr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GradientMenu />
        <PageTitle />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
