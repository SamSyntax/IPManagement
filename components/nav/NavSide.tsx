import { auth } from "@/auth";
import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import LinksListSide from "./LinksListSide";
import LogoMode from "./LogoMode";
import SignOut from "./SignOut";
import { ModeToggle } from "./theme-toggle";

const NavSide = async () => {
  const session = await auth();
  return (
    <nav className="flex flex-col w-[10vw]  p-4 justify-between h-screen border-muted/90 border items-start fixed">
      <div className="flex flex-col items-start w-full  justify-center xl:justify-start gap-16  text-xs">
        <div className="flex flex-col items-center justify-center  w-full h-full  ">
          <LogoMode size={250} />
        </div>
        <LinksListSide role={session?.user.role} />
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center gap-4 w-full ">
        <Button variant={"outline"} asChild size={"icon"}>
          <Link href={`/agent/${session?.user.id}`}>
            <User />
          </Link>
        </Button>
        <ModeToggle />
        <SignOut />
      </div>
    </nav>
  );
};

export default NavSide;
