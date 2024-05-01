import { auth } from "@/auth";
import Unathorized from "@/components/errPages/Unathorized";
import { prisma } from "@/lib/db";
import { formDate } from "@/lib/utils";
import { SheetIcon } from "lucide-react";
import Link from "next/link";
import UserCard from "../_components/UserCard";

const page = async () => {
  const agents = await prisma.agent.findMany().then((res) => res);

  const session = await auth();

  if (
    session?.user.role !== "GLOBAL_ADMIN" &&
    session?.user.role !== "USER_ADMIN"
  ) {
    return <Unathorized />;
  }

  const len = agents.length;

  return (
    <div className="w-[90vw] h-screen  flex flex-col items-center justify-start overflow-y-visible">
      <div className=" w-full gap-4 flex items-center justify-center p-12 border-b border-muted text-muted-foreground">
        <SheetIcon size={40} />
        <h1 className="text-3xl font-bold">List of Agents</h1>
      </div>
      <div
        className={
          len < 4
            ? `grid grid-cols-${len} gap-4 overflow-y-visible p-24 `
            : `grid grid-cols-4  gap-4 overflow-y-visible p-24  w-full`
        }>
        {agents.map((agent) => {
          return (
            <div
              key={agent.id}
              className="scale-100 hover:-translate-y-[2px]  transition-all ease-in-out duration-300 overflow-visible z-1 hover:z-10">
              <Link className="cursor-pointer" href={`/agent/${agent.id}`}>
                <UserCard
                  createdAt={formDate(agent.createdAt)}
                  email={agent.email}
                  name={agent.name}
                  surname={agent.surname}
                  role={agent.role}
                  simsId={agent.simsId}
                  id={agent.id}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
