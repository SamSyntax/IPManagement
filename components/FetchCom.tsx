import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";
import Card from "./Card";

const prisma = new PrismaClient();

export default function YourComponent() {
  const [ipAddresses, setIpAddresses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await prisma.iPAddress.findMany();
      const usersData = await prisma.user.findMany();

      const updatedIpAddresses = [];

      for (const user of usersData) {
        const ipAddress = await prisma.iPAddress.findFirst({
          where: { id: user.ipAddressId! },
        });
        updatedIpAddresses.push(ipAddress);
      }

      setIpAddresses(updatedIpAddresses);
    }

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-wrap">
        {ipAddresses.map((ip, i) => (
          <div className="" key={i}></div>
        ))}
      </div>
    </main>
  );
}
