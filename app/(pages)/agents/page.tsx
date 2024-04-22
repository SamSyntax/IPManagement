import { auth } from "@/auth";
import { formDate } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import React from "react";
import heroImg from "@/public/gifs/401_unauthorized.gif";

const page = async ({ ...props }) => {
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
    <div>
      {agents.map((agent) => (
        <div key={agent.id} className="flex flex-col space-y-2">
          <p>ID: {agent.id}</p>
          <p>Name: {agent.name}</p>
          <p>Surname: {agent.surname}</p>
          <p>SIMSID: {agent.simsId}</p>
          <p>Email: {agent.email}</p>
          <span className="flex space-x-2">
            <p>Role:</p>
            <input placeholder={agent.role} />
          </span>
          <p>Created At: {formDate(agent.createdAt)}</p>
        </div>
      ))}
    </div>
  );
};

export default page;
