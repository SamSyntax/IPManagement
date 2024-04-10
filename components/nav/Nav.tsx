"use client";
import React from "react";
import { Links } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/schenker_logo.svg";
import LogoLight from "@/public/images/schenker_logo_light.svg";
import { ModeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";

const Nav = () => {
  const { theme } = useTheme();

  const path = usePathname();

  return (
    <nav className="flex p-8 justify-between">
      <div className="flex items-center justify-start gap-4  text-xs">
        <div className="flex items-center justify-center">
          <Link href="/">
            {theme === "dark" || theme === "system" ? (
              <Image src={LogoLight} alt="Logo" width={150} height={150} />
            ) : (
              <Image src={Logo} alt="Logo" width={150} height={150} />
            )}
          </Link>
        </div>
        {Links.map((link) => (
          <Link
            className={
              path === link.href
                ? " font-medium text-primary transition-all ease-in-out duration-400 scale-105"
                : "font-medium text-muted-foreground transition-all ease-in-out duration-400"
            }
            key={link.label}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-2">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Nav;
