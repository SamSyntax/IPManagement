import "@/app/globals.css";
import Nav from "@/components/nav/Nav";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import React from "react";

const geist = GeistSans;
export const metadata: Metadata = {
  title: "DBS IP Management",
  description: "DB Schenker VPN IP Management application",
};
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <body className={geist.className}>
          <main className="flex overflow-x-hidden">
            <div className="w-[10vw]">
              <Nav />
            </div>
            <div>
              {children}
              <Toaster />
            </div>
          </main>
        </body>
      </ThemeProvider>
    </html>
  );
};
export default RootLayout;
