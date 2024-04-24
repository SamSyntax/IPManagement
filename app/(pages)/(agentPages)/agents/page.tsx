import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formDate } from "@/lib/utils";
import heroImg from "@/public/gifs/401_unauthorized.gif";
import Image from "next/image";
import Link from "next/link";
import UserCard from "../_components/UserCard";

const page: React.FC = async () => {
  const agents = await prisma.agent.findMany().then((res) => res);

  const session = await auth();

  if (
    session!.user.role !== "GLOBAL_ADMIN" &&
    session!.user.role !== "USER_ADMIN"
  ) {
    return (
      <div className="w-screen flex flex-col gap-5 items-center justify-center h-[80vh]">
        <h1 className="text-white/90 text-4xl">
          <b>401 | </b>Unauthorized
        </h1>
        <Image
          src={heroImg}
          className="rounded-sm"
          alt="YOU SHALL NOT PASS"
          width={1000}
          height={1000}
        />
      </div>
    );
  }
  return (
    <div className="w-screen h-screen p-12 flex items-start justify-center overflow-visible">
      <div className="grid grid-cols-3 gap-4 overflow-visible">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="scale-100 hover:-translate-y-[2px] shadow-2xl hover:drop-shadow-2xl shadow-primary/10 transition-all ease-in-out duration-300 overflow-visible z-1 hover:z-10"
          >
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
        ))}
      </div>
    </div>
  );
};

export default page;
