"use client";
import { Links } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LinksList = () => {
  const path = usePathname();
  return (
    <div className="flex gap-4 items-center justify-center">
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
  );
};

export default LinksList;
