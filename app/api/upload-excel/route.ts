import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const bodySchema = z.object({
  address: z.string().ip("v4"),
  type: z.enum(["P4", "P6"]),
  region: z.enum(["EMEA", "APAC", "AMERICAS", "AUSTRALIA"]),
});

export async function POST(req: Request, res: NextResponse) {
  try {
    // Parse the request body
    const data = await req.json();
    const existingAddresses: string[] = [];
    const addedAddresses: string[] = [];

    // Ensure that data is an array

    // Validate and process each entry in the data array
    for (const entry of data) {
      const validation = bodySchema.safeParse(entry);
      if (!validation.success) {
        return NextResponse.json(
          { message: "Input is invalid" },
          { status: 400 }
        );
      }

      const existingAddress = await prisma.iPAddress.findUnique({
        where: { address: entry.address },
      });

      if (existingAddress) {
        existingAddresses.push(entry.address);
        continue;
      }

      if (!existingAddress) {
        addedAddresses.push(entry.address);
        await prisma.iPAddress.create({
          data: entry,
        });
      }
    }

    if (addedAddresses.length === 0) {
      return NextResponse.json(
        {
          error: "All the addresses are already in the database",
        },
        { status: 410 }
      );
    }

    return NextResponse.json(
      {
        message:
          existingAddresses.length > 0
            ? `The following addresses already exist: ${existingAddresses.join(
                ", "
              )}, but the rest of the addresses have been added`
            : `All addresses were successfully added`,
      },
      { status: existingAddresses.length > 0 ? 201 : 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: `There was an error processing the request` },
      { status: 500 }
    );
  }
}
