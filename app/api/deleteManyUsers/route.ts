import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const simsIdSchema = z.string().length(8);

const userInputSchema = z.object({
  simsIds: z.array(simsIdSchema),
});

export async function POST(req: Request) {
  try {
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

    const { simsIds } = body;

    if (simsIds.length === 0) {
      return NextResponse.json(
        { error: "No SIMS IDs provided" },
        { status: 400 }
      );
    }

    const deletedUsers = [];

    for (const simsId of simsIds) {
      const user = await prisma.user.findFirst({
        where: {
          simsId: simsId,
        },
      });

      if (!user) {
        NextResponse.json(`User with SIMS ID ${simsId} not found`);
        continue; // Continue to the next iteration of the loop
      }

      const ipAddress = await prisma.iPAddress.findFirst({
        where: {
          simsId: simsId,
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

      await prisma.user.delete({
        where: {
          simsId: simsId,
        },
      });

      deletedUsers.push(simsId);
    }

    if (deletedUsers.length === 0) {
      return NextResponse.json(
        {
          error: "None of the provided SIMS IDs were found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Following users have been deleted: ${deletedUsers.join(", ")}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
