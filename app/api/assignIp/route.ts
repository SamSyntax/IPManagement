import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
const prisma = new PrismaClient();

const userInputSchema = z.object({
  simsId: z.string().length(8),
  type: z.enum(["P4", "P6"]),
  region: z.enum(["EMEA", "APAC", "AMERICAS"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = userInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Input data is invalid" },
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
    } else if (user.ipAddressId !== null) {
      return NextResponse.json(
        { error: "User already has an IP address" },
        { status: 400 }
      );
    }

    const freeIp = await prisma.iPAddress.findFirst({
      where: {
        isTaken: false,
        region: body.region,
        type: body.type,
      },
    });

    if (!freeIp) {
      return NextResponse.json(
        { error: "No free IP address available" },
        { status: 400 }
      );
    }

    await prisma.iPAddress.update({
      where: {
        id: freeIp.id,
      },
      data: {
        isTaken: true,
        user: {
          connect: {
            simsId: user.simsId,
            id: user.id,
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ipAddressId: freeIp.id,
      },
    });

    return NextResponse.json({
      message: `IP Address ${freeIp.address} has been assigned to ${user.simsId}`,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(res: Response) {
  try {
    // Fetch users with their associated IP addresses
    const ips = await prisma.iPAddress.findMany({});
    res.ok;

    // Return the users with a success status
    return NextResponse.json(ips, { status: 200 });
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