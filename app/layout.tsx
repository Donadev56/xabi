import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ChainsProvider } from "@/hooks/use_chains";
import App from "./app";
import { ConnectionProvider } from "@/hooks/use_connection";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "xABI",
  description: "Explore, read, and write to Ethereum smart contracts with an intuitive interface",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ChainsProvider>
            <ConnectionProvider>
              <App>{children}</App>
            </ConnectionProvider>
          </ChainsProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
