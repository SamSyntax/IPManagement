import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();

	try {
		const user = await prisma.user.findFirst({
			where: {
				simsId: body.simsId,
			},
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const ipAddress = await prisma.iPAddress.findFirst({
			where: {
				simsId: user.simsId,
			},
		});

		if (!ipAddress) {
			return NextResponse.json(
				{ error: "IP Address not found" },
				{ status: 404 }
			);
		}

		await prisma.iPAddress.update({
			where: {
				simsId: user.simsId,
			},
			data: {
				isTaken: false,
				simsId: null,
				updatedAt: new Date(),
			},
		});

		await prisma.user.update({
			where: {
				simsId: user.simsId,
			},
			data: {
				ipAddressId: null,
				address: null,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json({
			message: `IP Address ${ipAddress.address} has been removed from user ${user.simsId}`,
		});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
