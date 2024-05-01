import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
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

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const validation = userInputSchema.safeParse(body);

		let isExisting: boolean = false;

		const session = await auth();

		const agentId = session?.user.id;

		console.log(agentId);

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
		const user = await prisma.user.findFirst({
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

		if (!ipAddress) {
			return NextResponse.json(
				{ error: "No free IP address available" },
				{ status: 400 }
			);
		}

		if (user && user.address === null) {
			await prisma.user.update({
				where: {
					simsId: body.simsId,
				},
				data: {
					ipAddressId: ipAddress?.id,
					address: ipAddress?.address,
					updatedAt: new Date(),
					action: {
						create: {
							actionType: `Updating user ${body.simsId}`,
							addressId: ipAddress?.id!,
							agentId: agentId!,
						},
					},
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

		if (!user) {
			await prisma.user.create({
				data: {
					simsId: body.simsId,
					ipAddressId: ipAddress.id,
					address: ipAddress.address,
					action: {
						create: {
							actionType: `Creating user ${body.simsId}`,
							addressId: ipAddress.id,
							agentId: agentId!,
						},
					},
				},
			});
		}

		await prisma.iPAddress.update({
			where: {
				id: ipAddress.id,
			},

			data: {
				isTaken: true,
				updatedAt: new Date(),
				user: {
					connect: {
						simsId: body.simsId,
						id: user?.id,
					},
				},
			},
		});

		revalidatePath;

		return NextResponse.json(
			{
				message: isExisting
					? `IP Address ${ipAddress.address} has been assigned to ${body.simsId}`
					: `IP Address ${ipAddress.region} ${ipAddress.type} ${ipAddress.address} has been assigned to ${body.simsId}`,
				workNotes: `Vendor IP ${ipAddress.type} (${ipAddress.region}) ${ipAddress.address} has been added`,
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
		const users = await prisma.user.findMany({
			include: {
				ipAddress: true,
				action: true,
			},
		});

		// Return the users with a success status
		return NextResponse.json(users, { status: 200 });
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
