import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function DELETE(req: Request) {
  try {
    const response = await prisma.iPAddress.deleteMany({
      where: {
        simsId: null,
        isTaken: false,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
