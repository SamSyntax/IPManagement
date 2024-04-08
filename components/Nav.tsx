"use client";
import React, { useState } from "react";
import { Links } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddUserPopup from "./forms/addUserForm";
import { Button } from "./ui/button";
import Image from "next/image";
import Logo from "../public/images/schenker_logo.svg";

const Nav = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to toggle the visibility of the popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const path = usePathname();
  return (
    <nav className="flex p-8 justify-between">
      <div className="flex items-center justify-start gap-4  text-xs">
        {Links.map((link) => (
          <Link
            className={
              path === link.href
                ? " font-medium text-rose-700 transition-all ease-in-out duration-400 scale-105"
                : "font-medium text-zinc-950 transition-all ease-in-out duration-400"
            }
            key={link.label}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <Link href="/">
          <Image src={Logo} alt="Logo" width={150} height={150} />
        </Link>
      </div>
      <div className="flex">
        <Button variant="outline" onClick={togglePopup}>
          Add User
        </Button>
        {isPopupOpen && <AddUserPopup onClose={togglePopup} />}
      </div>
    </nav>
  );
};

export default Nav;
