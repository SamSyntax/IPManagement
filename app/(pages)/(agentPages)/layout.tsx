import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import React, { Suspense } from "react";
import PageLoading from "../(root)/loading";

const AgentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <main className="overflow-x-hidden">
        <Suspense fallback={<PageLoading />}> {children}</Suspense>
      </main>
      <Toaster />
    </section>
  );
};
export default AgentLayout;
