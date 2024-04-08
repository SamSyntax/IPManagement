// pages/api/searchUsers.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const users = await prisma.user.findMany({
      where: {
        simsId: {
          startsWith: body.simsId, // Default to empty string if startsWith is not provided
        },
      },
      include: {
        ipAddress: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error searching for users:", error);
    NextResponse.json({ error: error }, { status: 500 });
  }
}
