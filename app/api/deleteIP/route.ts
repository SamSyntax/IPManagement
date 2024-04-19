import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const ip = await prisma.iPAddress.findFirst({
      where: {
        address: body.address,
      },
    });

    if (!ip) {
      return NextResponse.json({ error: "IP not found" }, { status: 400 });
    }

    await prisma.iPAddress.delete({
      where: {
        id: ip.id,
      },
    });

    if (ip.simsId !== null) {
      await prisma.user.update({
        where: {
          simsId: ip.simsId,
        },
        data: {
          address: null,
          ipAddressId: null,
        },
      });
    }

    return NextResponse.json(
      { message: `Address ${body.address} has been deleted successfully` },
      { status: 200 }
    );
  } catch (err) {
    NextResponse.json(
      { error: `Something went wrong ${err}` },
      { status: 500 }
    );
  }
}
