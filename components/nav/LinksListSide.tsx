"use client";
import { Links } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const LinksListSide = (role: any) => {
  const path = usePathname();

  return (
    <div className="flex flex-col gap-4 items-start justify-center w-full text-sm  md:text-xl">
      {Links.map((link) => {
        const IconComponent = link.icon();
        return (
          <Button
            key={link.label}
            variant={"ghost"}
            aria-disabled={
              (link.accessLevel === "USER_ADMIN" &&
                role.role !== "USER_ADMIN" &&
                role.role !== "GLOBAL_ADMIN") ||
              (link.accessLevel === "GLOBAL_ADMIN" &&
                role.role !== "GLOBAL_ADMIN")
            }
            className="w-full py-2 md:py-8 flex gap-4 items-center justify-start text-xs md:text-sm  transition-all ease-in-out duration-400 hover:text-primary text-muted-foreground"
            asChild={true}>
            <Link
              className={
                path === link.href
                  ? " font-normal  w-full text-primary gap-2 transition-all ease-in-out duration-400  flex items-center justify-center xl:justify-start  "
                  : "font-normal w-full  flex gap-2  items-center justify-center xl:justify-start "
              }
              key={link.label}
              href={link.href}>
              <IconComponent className="" size={20} />
              <span className="hidden xl:block">{link.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

export default LinksListSide;
