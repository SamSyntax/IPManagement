import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const address = await prisma.iPAddress.findFirst({
      where: {
        address: body.address,
      },
    });

    if (!address) {
      return NextResponse.json({ error: "IP not found" }, { status: 400 });
    }

    if (address.simsId !== null) {
      const user = await prisma.user.findFirst({
        where: {
          simsId: address.simsId,
        },
      });

      if (user) {
        await prisma.user.update({
          where: {
            simsId: address.simsId,
          },
          data: {
            address: null,
            ipAddressId: null,
            updatedAt: new Date(),
          },
        });
      }
    }

    await prisma.iPAddress.delete({
      where: {
        id: address.id,
      },
    });

    return NextResponse.json(
      {
        message: `IP Address: ${body.address} has been deleted `,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
