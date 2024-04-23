import React from "react";

import { ModeToggle } from "./theme-toggle";
import SignOut from "./SignOut";
import LogoMode from "./LogoMode";
import LinksList from "./Links";

const NavContent = () => {
  return (
    <nav className="flex p-8 justify-between w-screen">
      <div className="flex items-center justify-start gap-4  text-xs">
        <div className="flex items-center justify-center">
          <LogoMode />
        </div>
        <LinksList />
      </div>

      <div className="flex items center justify-center gap-2 ">
        <ModeToggle />
        <SignOut />
      </div>
    </nav>
  );
};

export default NavContent;
