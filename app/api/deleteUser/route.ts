import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const simsIdSchema = z.string().length(8);

const userInputSchema = z.object({
  simsId: simsIdSchema,
});

export async function POST(req: Request) {
  try {
    // Znajdź adres IP przypisany do usuniętego użytkownika i ustaw isTaken na false

    const body = await req.json();

    const validation = userInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: `Input data is invalid`,
        },
        { status: 400 }
      );
    }
    const user = await prisma.user.delete({
      where: {
        simsId: body.simsId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }

    if (user && user.ipAddressId !== null) {
      await prisma.iPAddress.update({
        where: {
          id: user.ipAddressId,
        },
        data: {
          isTaken: false,
        },
      });
    }

    return NextResponse.json(
      { message: `User ${body.simsId} has been deleted` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
