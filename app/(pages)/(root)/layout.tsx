import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@/app/globals.css";
import Nav from "@/components/nav/Nav";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import React, { Suspense } from "react";
import PageLoading from "../(ipActions)/ipAddresses/loading";

const geist = GeistSans;
export const metadata: Metadata = {
  title: "DBS IP Management",
  description: "DB Schenker VPN IP Management application",
};

// @ts-ignore
const RootLayout = ({ children }) => {
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
};
export default RootLayout;
