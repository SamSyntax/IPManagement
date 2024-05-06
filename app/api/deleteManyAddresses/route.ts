import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { IPAddress } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const ipSchema = z.string().ip("v4");

const userInputSchema = z.object({
	ips: z.array(ipSchema),
});

export async function POST(req: Request) {
	const session = await auth();
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

		const { ips } = body;

		if (ips.length === 0) {
			return NextResponse.json(
				{ error: "No SIMS IDs provided" },
				{ status: 400 }
			);
		}

		const deletedIPs: string[] = [];
		const unexistingIPs: string[] = [];

		const addresses: (IPAddress | null)[] = await prisma.iPAddress.findMany({
			where: {
				address: { in: ips },
			},
		});

		for (const address of addresses) {
			if (!address) {
				unexistingIPs.push(address!.address); // Placeholder string to satisfy type checker
				continue; // Continue to the next iteration of the loop
			}

			if (address.simsId) {
				await prisma.user.update({
					where: {
						simsId: address.simsId,
					},
					data: {
						ipAddressId: null,
						address: null,
						updatedAt: new Date(),
						action: {
							create: {
								actionType: `Removing ${address.address} from ${address.simsId} and deleting it (BULK OPERATION)`,
								addressId: address.id,
								agentId: session?.user.id!,
							},
						},
					},
				});
			}

			if (address) {
				await prisma.iPAddress.delete({
					where: {
						address: address.address,
					},
				});

				deletedIPs.push(address.address);
			}
		}
		await prisma.action.create({
			data: {
				actionType: `Removing ${deletedIPs.length} IP Addresses from database`,
				agentId: session?.user.id!,
			},
		});
		if (deletedIPs.length === 0) {
			return NextResponse.json(
				{
					error: `None of the provided IP Addresses were found`,
				},
				{ status: 404 }
			);
		} else {
			return NextResponse.json(
				{
					message: `Following IP Addresses have been deleted: ${deletedIPs.join(
						", "
					)}`,
				},
				{ status: 200 }
			);
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
