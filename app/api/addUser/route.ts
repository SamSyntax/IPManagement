import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const simsIdSchema = z.string().length(8);
const regionSchema = z.enum(["EMEA", "APAC", "AMERICAS"]);
const typeSchema = z.enum(["P4", "P6"]);

const userInputSchema = z.object({
  simsId: simsIdSchema,
  region: regionSchema,
  type: typeSchema,
});

const prisma = new PrismaClient();

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

    if (body.type === null || body.region === null) {
      return NextResponse.json(
        { error: "Missing type or region" },
        { status: 400 }
      );
    }
    let user = await prisma.user.findUnique({
      where: {
        simsId: body.simsId,
      },
    });

    if (user && user?.ipAddressId !== null) {
      return NextResponse.json(
        { error: "User already has an IP Address assigned" },
        { status: 405 }
      );
    }
    const ipAddress = await prisma.iPAddress.findFirst({
      where: {
        region: body.region,
        type: body.type,
        isTaken: false,
      },
    });

    if (!ipAddress) {
      return NextResponse.json(
        { error: "No free IP address available" },
        { status: 400 }
      );
    }

    if (!user) {
      await prisma.user.create({
        data: {
          simsId: body.simsId,
          ipAddressId: ipAddress.id,
          ip: ipAddress.address,
        },
      });
    }

    await prisma.iPAddress.update({
      where: {
        id: ipAddress.id,
      },

      data: {
        isTaken: true,
        user: {
          connect: {
            simsId: body.simsId,
            id: user?.id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: `IP Address ${ipAddress.region} ${ipAddress.type} ${ipAddress.address} has been assigned to ${body.simsId}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      error: `Wystąpił błąd podczas dodawania użytkownika: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}
