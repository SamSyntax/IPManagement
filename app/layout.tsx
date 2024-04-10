import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav/Nav";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DBS IP Management",
  description: "DB Schenker VPN IP Management application",
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: never;
}>) {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <body className={inter.className}>
          <Nav />
          <main className="overflow-x-hidden">{children}</main>
        </body>
      </ThemeProvider>
    </html>
  );
}
