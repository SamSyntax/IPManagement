import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";
import PageLoading from "../../(root)/loading";
import { Toaster } from "@/components/ui/toaster";
// @ts-ignore
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <body className={GeistSans.className}>
          <main className="overflow-x-hidden">
            <Suspense fallback={<PageLoading />}> {children}</Suspense>
          </main>
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  );
};

export default AuthLayout;
