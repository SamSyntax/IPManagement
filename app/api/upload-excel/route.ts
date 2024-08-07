import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
	address: z.string().ip("v4"),
	type: z.enum(["P4", "P6"]),
	region: z.enum(["EMEA", "APAC", "AMERICAS", "AUSTRALIA"]),
});

export async function POST(req: Request, res: NextResponse) {
	const session = await auth();

	try {
		const data = await req.json();
		const validationResults = data.map((entry: any) =>
			bodySchema.safeParse(entry)
		);

		const invalidEntries = validationResults.filter(
			(result: any) => !result.success
		);
		if (invalidEntries.length > 0) {
			return NextResponse.json(
				{
					message: "Input is invalid",
					errors: invalidEntries.map((result: any) => result.error),
				},
				{ status: 400 }
			);
		}

		const existingAddresses = await prisma.iPAddress.findMany({
			where: { address: { in: data.map((entry: any) => entry.address) } },
			select: { address: true },
		});

		const existingAddressMap = new Set(
			existingAddresses.map((address) => address.address)
		);
		const addedAddresses = [];

		const newAddresses = data.filter(
			(entry: any) => !existingAddressMap.has(entry.address)
		);
		if (newAddresses.length > 0) {
			await prisma.iPAddress.createMany({
				data: newAddresses,
				skipDuplicates: true,
			});
			addedAddresses.push(...newAddresses.map((entry: any) => entry.address));

			await prisma.action.create({
				data: {
					agentId: session?.user.id!,
					message: "Uploading addresses to the database",
					actionType: "CREATE",
				},
			});
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
					addedAddresses.length > 0
						? `Addresses successfully added: ${addedAddresses.join(", ")}`
						: `All addresses were already in the database`,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error processing request:", error);
		return NextResponse.json(
			{ error: `There was an error processing the request` },
			{ status: 500 }
		);
	}
}
