import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const simsIdSchema = z.string().length(8);

const userInputSchema = z.object({
	simsIds: z.array(simsIdSchema),
});

export async function POST(req: Request) {
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

		const { simsIds } = body;

		if (simsIds.length === 0) {
			return NextResponse.json(
				{ error: "No SIMS IDs provided" },
				{ status: 400 }
			);
		}

		const deletedUsers: string[] = [];
		const unexistingUsers: string[] = [];

		const users: (User | null)[] = await prisma.user.findMany({
			where: {
				simsId: { in: simsIds },
			},
			include: {
				ipAddress: true,
			},
		});

		for (const user of users) {
			if (!user) {
				unexistingUsers.push(simsIds); // Placeholder string to satisfy type checker
				continue; // Continue to the next iteration of the loop
			}

			if (user.ipAddressId) {
				await prisma.iPAddress.update({
					where: {
						id: user.ipAddressId,
					},
					data: {
						isTaken: false,
						updatedAt: new Date(),
					},
				});
			}

			if (user) {
				await prisma.user.delete({
					where: {
						simsId: user.simsId,
					},
				});

				deletedUsers.push(user.simsId);
			}
		}
		if (deletedUsers.length === 0) {
			return NextResponse.json(
				{
					error: `None of the provided SIMS IDs were found`,
				},
				{ status: 404 }
			);
		} else {
			return NextResponse.json(
				{
					message: `Following users have been deleted: ${deletedUsers.join(
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
