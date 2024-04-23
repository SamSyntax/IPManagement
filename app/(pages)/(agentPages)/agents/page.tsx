import { auth } from "@/auth";
import { formDate } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import React from "react";
import heroImg from "@/public/gifs/401_unauthorized.gif";
import UserCard from "../_components/UserCard";
import Link from "next/link";

// @ts-ignore
const Home: React.FC = async () => {
  const prisma = new PrismaClient();
  const agents = await prisma.agent.findMany().then((res) => res);

  const session = await auth();

  if (
    session?.user.role !== "GLOBAL_ADMIN" &&
    session?.user.role !== "USER_ADMIN"
  ) {
    console.log(session?.user.role);
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
    <div className="w-screen h-auto p-12 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="scale-100 hover:-translate-y-2 transition-transform ease-in-out duration-300 "
          >
            <Link className="cursor-pointer  " href={`/agent/${agent.id}`}>
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

export default Home;
