import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const userInputSchema = z.object({
  ipAddress: z.string().ip("v4"),
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = userInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const ipAddress = await prisma.iPAddress.findFirst({
      where: {
        address: body.ipAddress,
      },
    });

    if (!ipAddress) {
      return NextResponse.json(
        { error: `IP address ${body.ipAddress} could not be found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `IP address: ${ipAddress.address} has been found`,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
