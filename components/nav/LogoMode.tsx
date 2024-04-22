"use client";

import Image from "next/image";
import Logo from "@/public/images/schenker_logo.svg";
import LogoLight from "@/public/images/schenker_logo_light.svg";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";

const LogoMode = () => {
  const { theme } = useTheme();
  return (
    <div>
      <Link href="/">
        {theme === "dark" || theme === "system" ? (
          <Image src={LogoLight} alt="Logo" width={150} height={150} />
        ) : (
          <Image src={Logo} alt="Logo" width={150} height={150} />
        )}
      </Link>
    </div>
  );
};

export default LogoMode;
