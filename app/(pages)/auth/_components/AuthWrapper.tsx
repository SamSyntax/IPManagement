"use client";

import { ModeToggle } from "@/components/nav/theme-toggle";
import Logo from "@/public/images/schenker_logo.svg";
import LogoLight from "@/public/images/schenker_logo_light.svg";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import Login from "./forms/Login";

const AuthWrapper = ({ ...props }) => {
  const { theme, systemTheme } = useTheme();
  return (
    <div className="flex flex-col  h-full w-screen">
      <div className="w-screen flex items-center justify-end p-8 sticky">
        <ModeToggle />
      </div>
      <div className="flex flex-col w-screen items-center h-screen justify-center">
        <Tabs defaultValue="SignIn" className=" w-[400px] ">
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="flex w-full justify-center items-center">
              {theme === "dark" ||
              (theme === "system" && systemTheme === "dark") ? (
                <Image src={LogoLight} alt="DB Schenker Logo" width={200} />
              ) : (
                <Image src={Logo} alt="DB Schenker Logo" width={200} />
              )}
            </div>
            <div className="w-[400px] flex flex-col items-center justify-center">
              <TabsList className="w-full !bg-card  border border-muted">
                <TabsTrigger className="w-full !bg-transparent" value="SignIn">
                  Sign In
                </TabsTrigger>
              </TabsList>
              <TabsContent value="SignIn">
                <div className="flex items-center justify-center">
                  <Login />
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthWrapper;
