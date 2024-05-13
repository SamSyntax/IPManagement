import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
	const { addressId } = await req.json();

	try {
		const actions = await prisma.action.findMany({
			where: {
				addressId: addressId,
			},
			include: {
				user: true,
				ipAddress: true,
				agent: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return NextResponse.json(actions, {
			status: 200,
		});
	} catch (error: any) {
		return new Response(error, {
			status: 500,
		});
	}
}
