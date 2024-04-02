import AddUser from "@/components/addUserForm";
import Card from "@/components/Card";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const ipAddress = await prisma.iPAddress.findMany({});

  const users = await prisma.user.findMany({});

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-wrap">
         <AddUser />
      </div>
    </main>
  );
}
