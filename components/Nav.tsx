"use client";
import React, { useState } from "react";
import { Links } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddUserPopup from "./forms/addUserForm";
import { Button } from "./ui/button";

const Nav = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to toggle the visibility of the popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const path = usePathname();
  return (
    <nav className="flex">
      <div className="flex items-center justify-start gap-4 p-8">
        {Links.map((link) => (
          <Link
            className={
              path === link.href
                ? "text-red-600 font-medium"
                : "text-black font-medium"
            }
            key={link.label}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
        <Button variant="outline" onClick={togglePopup}>
          Add User
        </Button>
        {isPopupOpen && <AddUserPopup onClose={togglePopup} />}
      </div>
      <div className="flex"></div>
    </nav>
  );
};

export default Nav;
