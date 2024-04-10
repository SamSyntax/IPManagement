import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
