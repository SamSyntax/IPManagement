import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const session = await auth();

	const agentId = session?.user.id!;

	try {
		const body = await req.json();

		const address = await prisma.iPAddress.findFirst({
			where: {
				address: body.address,
			},
		});

		if (!address) {
			return NextResponse.json({ error: "IP not found" }, { status: 400 });
		}

		if (address.simsId !== null) {
			const user = await prisma.user.findFirst({
				where: {
					simsId: address.simsId,
				},
			});

			if (user) {
				await prisma.user.update({
					where: {
						simsId: address.simsId,
					},
					data: {
						address: null,
						ipAddressId: null,
						updatedAt: new Date(),
						action: {
							create: {
								actionType: `Removing ${address.address} from ${user.simsId} and deleting it.`,
								addressId: address.id,
								agentId: agentId,
							},
						},
					},
				});
			}
		}

		await prisma.iPAddress.delete({
			where: {
				id: address.id,
			},
		});

		return NextResponse.json(
			{
				message: `IP Address: ${body.address} has been deleted `,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
