import Card from "@/components/Card";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const ipAddress = await prisma.iPAddress.findMany({});

  const users = await prisma.user.findMany({});

  {
    users.map(async (user) => {
      const ip = await prisma.iPAddress.findFirst({
        where: { simsId: "PAJAROSZ" },
      });
      console.log(ip);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-wrap">
        {ipAddress.map((ip, i) => (
          <div className="" key={i}>
            <Card imie={ip.region} adres={ip.address} simsid={ip.simsId} />
          </div>
        ))}
      </div>
    </main>
  );
}
