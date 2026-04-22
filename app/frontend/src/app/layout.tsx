import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClubSwitcher from "@/components/ClubSwitcher";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Goal Tracker",
  description: "Track the goal counts of your matches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <ClubSwitcher />
        {children}
      </body>
    </html>
  );
}
