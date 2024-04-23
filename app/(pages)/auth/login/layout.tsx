import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";
import PageLoading from "../../(root)/loading";
import { Toaster } from "@/components/ui/toaster";
// @ts-ignore
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <body className={GeistSans.className}>
      <Suspense fallback={<PageLoading />}> {children}</Suspense>
    </body>
  );
};

export default AuthLayout;
