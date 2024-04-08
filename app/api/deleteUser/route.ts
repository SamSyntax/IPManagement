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
    const user = await prisma.user.findFirst({
      where: {
        simsId: body.simsId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    const ipAddress = await prisma.iPAddress.findFirst({
      where: {
        simsId: body.simsId,
      },
    });


    if (ipAddress) {
      await prisma.iPAddress.update({
        where: {
          id: ipAddress.id,
        },
        data: {
          isTaken: false,
        },
      });
    }
    // Usuń użytkownika
    await prisma.user.delete({
      where: {
        simsId: body.simsId,
      },
    });

    return NextResponse.json(
      { message: `Usunięto użytkownika ${body.simsId}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
