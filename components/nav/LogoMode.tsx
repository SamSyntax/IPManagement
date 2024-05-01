"use client";

import Logo from "@/public/images/schenker_logo.svg";
import LogoLight from "@/public/images/schenker_logo_light.svg";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface Props {
  size?: number;
}

const LogoMode = ({ size }: Props) => {
  const { theme } = useTheme();
  return (
    <div className="flex p-4 items-center justify-center w-full">
      <Link href="/">
        {theme === "dark" || theme === "system" ? (
          <Image
            src={LogoLight}
            alt="Logo"
            width={size !== undefined ? size : 150}
            height={size !== undefined ? size : 150}
          />
        ) : (
          <Image
            src={Logo}
            alt="Logo"
            width={size !== undefined ? size : 150}
            height={size !== undefined ? size : 150}
          />
        )}
      </Link>
    </div>
  );
};

export default LogoMode;
