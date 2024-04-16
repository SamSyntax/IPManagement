import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const simsIdSchema = z.string().length(8);
const regionSchema = z.enum(["EMEA", "APAC", "AMERICAS", "AUSTRALIA"]);
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

    let isExisting: boolean = false;

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
      include: {
        ipAddress: true,
      },
    });

    const ipAddress = await prisma.iPAddress.findFirst({
      where: {
        region: body.region,
        type: body.type,
        isTaken: false,
      },
    });
    if (user && user.ip === null) {
      await prisma.user.update({
        where: {
          simsId: body.simsId,
        },
        data: {
          ipAddressId: ipAddress?.id,
          ip: ipAddress?.address,
        },
      });
      isExisting = true;
    }

    if (user && user?.ipAddressId !== null) {
      return NextResponse.json(
        {
          error: `User ${user.simsId} already has an IP Address assigned: ${user.ipAddress?.address} type: ${user.ipAddress?.type} region: ${user.ipAddress?.region}`,
        },
        { status: 405 }
      );
    }

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
        message: isExisting
          ? `IP Address ${ipAddress.address} has been assigned to ${body.simsId}`
          : `IP Address ${ipAddress.region} ${ipAddress.type} ${ipAddress.address} has been assigned to ${body.simsId}`,
      },
      { status: isExisting ? 201 : 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: `There was an error adding a user: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}


export async function GET(req: Request, res: Response) {
  try {
    // Fetch users with their associated IP addresses
    const usersWithIPs = await prisma.user.findMany({
      include: {
        ipAddress: true,
      },
    });
    res.ok;

    // Return the users with a success status
    return NextResponse.json(usersWithIPs, { status: 200 });
  } catch (error) {
    // If an error occurs, handle it gracefully
    console.error("Error occurred while fetching users:", error);

    // Return an error response with a 500 status
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    // Ensure to disconnect the Prisma client after the operation
    await prisma.$disconnect();
  }
}
