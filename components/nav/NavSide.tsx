import { auth } from "@/auth";
import LinksListSide from "./LinksListSide";
import LogoMode from "./LogoMode";
import SignOut from "./SignOut";
import { ModeToggle } from "./theme-toggle";

const NavSide = async () => {
  const session = await auth();
  return (
    <nav className="flex flex-col w-[10vw]  p-8 justify-between h-screen border-muted/90 border items-start fixed">
      <div className="flex flex-col items-start w-full   justify-start gap-16  text-xs">
        <div className="flex flex-col items-center justify-center  w-full ">
          <LogoMode size={250} />
        </div>
        <LinksListSide role={session?.user.role} />
      </div>

      <div className="flex items center justify-center gap-4 w-full ">
        <ModeToggle />
        <SignOut />
      </div>
    </nav>
  );
};

export default NavSide;
