import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validate data with zod
const userInputSchema = z.object({
	simsId: z.string().length(8),
	region: z.enum(["EMEA", "APAC", "AMERICAS", "AUSTRALIA"]),
	type: z.enum(["P4", "P6"]),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const session = await auth();
		const agentId = session?.user.id;

		// Checking input
		const validation = userInputSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: "Input data is invalid" },
				{ status: 400 }
			);
		}

		const [user, freeIp] = await Promise.all([
			prisma.user.findFirst({
				where: {
					simsId: body.simsId,
				},
			}),
			prisma.iPAddress.findFirst({
				where: {
					isTaken: false,
					region: body.region,
					type: body.type,
				},
			}),
		]);

		if (user && freeIp) {
			const transactionPromises = [];

			if (user.ipAddressId) {
				transactionPromises.push(
					prisma.iPAddress.update({
						where: {
							id: user.ipAddressId,
						},
						data: {
							isTaken: false,
							simsId: null,
							updatedAt: new Date(),
							action: {
								create: {
									message: `Removing address from ${body.simsId}`,
									userId: user.id!,
									actionType: "MODIFY",
									agentId: agentId!,
								},
							},
						},
					})
				);
			}

			// Zwalniamy poprzedni adres IP przypisany do identyfikatora SIM

			// Zaktualizujemy dane użytkownika, przypisując mu nowy adres IP

			transactionPromises.push(
				prisma.user.update({
					where: { simsId: body.simsId },
					data: {
						ipAddressId: freeIp.id,
						address: freeIp.address,
						updatedAt: new Date(),
						action: {
							create: {
								message: `Assigning a new address to ${body.simsId}`,
								addressId: freeIp.id!,
								actionType: "MODIFY",
								agentId: agentId!,
							},
						},
					},
					include: {
						ipAddress: true,
					},
				}),
				prisma.iPAddress.update({
					where: {
						id: freeIp.id,
					},
					data: {
						isTaken: true,
						simsId: body.simsId,
						updatedAt: new Date(),
					},
				})
			);

			await prisma.$transaction(transactionPromises);

			revalidatePath("/users");
			revalidatePath("/addresses");

			return NextResponse.json(
				{
					message: `A new IP Address: ${freeIp.address} region: ${freeIp.region} type: ${freeIp.type} has been assigned to ${user.simsId}.`,
				},
				{ status: 200 }
			);
		} else {
			// Obsługa błędu w przypadku braku użytkownika lub wolnego adresu IP
			return NextResponse.json(
				{ message: "No available IP Addresses" },
				{ status: 200 }
			);
		}
	} catch (error) {
		console.error("Request validation error:", error);
		return NextResponse.json(
			{ message: "Request validation error", error },
			{ status: 500 }
		);
	}
}
