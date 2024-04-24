import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const simsIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]+$/, "No special characters are allowed")
  .length(8);
const regionSchema = z.enum(["EMEA", "APAC", "AMERICAS", "AUSTRALIA"]);
const typeSchema = z.enum(["P4", "P6"]);

const userInputSchema = z.object({
  simsId: simsIdSchema,
  region: regionSchema,
  type: typeSchema,
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();
  try {
    const body = await req.json();

    const validation = userInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Input data is invalid" },
        { status: 400 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "User session not found" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { simsId: body.simsId },
      include: { ipAddress: true },
    });

    if (user && user.ipAddressId) {
      return NextResponse.json(
        {
          error: `User ${user.simsId} already has an IP Address assigned: ${user.ipAddress?.address} type: ${user.ipAddress?.type} region: ${user.ipAddress?.region}`,
        },
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
      const createdUser = await prisma.user.create({
        data: {
          simsId: body.simsId,
          ipAddress: { connect: { id: ipAddress.id } },
          address: ipAddress.address,
          ipAddressId: ipAddress.id, // Connect the user to the IP address
          actions: {
            create: {
              actionType: "CREATE_IP_ADDRESS",
              agentId: session.user.id!,
              ipAddressId: ipAddress.id,
            },
          },
        },
      });

      await prisma.iPAddress.update({
        where: { id: ipAddress.id },
        data: { isTaken: true, simsId: createdUser.simsId },
      });
    }

    if (user && ipAddress.id !== null) {
      await prisma.iPAddress.update({
        where: { id: ipAddress.id },
        data: {
          user: { connect: { id: user.id } },
          isTaken: true,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      {
        message: `IP Address ${ipAddress.address} has been assigned to ${body.simsId}`,
        workNotes: `Vendor IP ${ipAddress.type} (${ipAddress.region}) ${ipAddress.address} has been added`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred while adding a user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      include: { ipAddress: true },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error occurred while fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
