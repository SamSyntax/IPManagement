"use client";

import Image from "next/image";
import Logo from "@/public/images/schenker_logo.svg";
import LogoLight from "@/public/images/schenker_logo_light.svg";
import { ModeToggle } from "@/components/nav/theme-toggle";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "./forms/Login";
import { useTheme } from "next-themes";
import Register from "./forms/Register";

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
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="SignIn">
                  Sign In
                </TabsTrigger>
                <TabsTrigger className="w-full" value="SignUp">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="SignIn">
                <div className="flex items-center justify-center">
                  <Login />
                </div>
              </TabsContent>
              <TabsContent value="SignUp">
                <Register />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthWrapper;
