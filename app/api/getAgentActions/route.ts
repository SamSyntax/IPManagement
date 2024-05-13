import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
	const { agentId } = await req.json();

	try {
		const actions = await prisma.action.findMany({
			where: {
				agentId: agentId,
			},
			include: {
				user: true,
				ipAddress: true,
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
