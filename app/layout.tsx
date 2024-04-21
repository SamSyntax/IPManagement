import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Nav from "@/components/nav/Nav";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import PageLoading from "./(pages)/(ipActions)/ipAddresses/loading";

const inter = Inter({ subsets: ["latin"] });
const geist = GeistSans;
export const metadata: Metadata = {
  title: "DBS IP Management",
  description: "DB Schenker VPN IP Management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <body className={geist.className}>
          <Nav />
          <main className="overflow-x-hidden">
            <Suspense fallback={<PageLoading />}> {children}</Suspense>
          </main>
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  );
}
