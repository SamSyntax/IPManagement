import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div>{children}</div>
    </ThemeProvider>
  );
};

export default AuthLayout;
