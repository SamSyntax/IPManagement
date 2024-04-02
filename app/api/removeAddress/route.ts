import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const userInputSchema = z.object({
  simsId: z.string().length(8),
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = userInputSchema.safeParse(body);

    let len = "";

    if (body.simsId.length < 8) {
      len = "is too short";
    } else if (body.simsId.length > 8) {
      len = "is too long";
    }

    if (!validation.success) {
      return NextResponse.json(
        {
          error: `SIMSID ${body.simsId} ${len}. Please make sure it's exactly 8 characters long`,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        simsId: body.simsId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ipAddress = await prisma.iPAddress.findFirst({
      where: {
        simsId: user.simsId,
      },
    });

    if (!ipAddress) {
      return NextResponse.json(
        { error: "IP Address not found" },
        { status: 404 }
      );
    }

    await prisma.iPAddress.update({
      where: {
        id: ipAddress.id,
      },
      data: {
        isTaken: false,
        simsId: null,
      },
    });

    await prisma.user.update({
      where: {
        simsId: user.simsId,
      },
      data: {
        ipAddressId: null,
      },
    });

    return NextResponse.json({
      message: `IP Address ${ipAddress.address} has been removed from user ${user.simsId}`,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
