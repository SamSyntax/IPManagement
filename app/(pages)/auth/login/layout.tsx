import "@/app/globals.css";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";
import PageLoading from "../../(ipActions)/ipAddresses/loading";
// @ts-ignore
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <body className={GeistSans.className}>
      <Suspense fallback={<PageLoading />}> {children}</Suspense>
    </body>
  );
};

export default AuthLayout;
