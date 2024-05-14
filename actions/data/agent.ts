"use server";

import { prisma } from "@/lib/db";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteAgent(id: string, requestor: Session) {
	const requestorFetch = await prisma.agent.findUnique({
		where: {
			id: requestor.user.id,
		},
	});
	const requestorRole = requestorFetch?.role;
	try {
		const agent = await prisma.agent.findUnique({
			where: {
				id: id,
			},
		});

		if (!agent) {
			return { error: "Agent doesn't exist." };
		}
		if (requestorRole !== "USER_ADMIN" && requestorRole !== "GLOBAL_ADMIN") {
			return { error: "You don't have permission to delete the Agent!" };
		}

		if (agent?.role === "GLOBAL_ADMIN" && requestorRole !== "GLOBAL_ADMIN") {
			return {
				error: "You don't have permission to delete the Global Admin Agent!",
			};
		}

		const deleteAgent = await prisma.agent.delete({
			where: {
				id: id,
			},
		});
		revalidatePath("/agents");
		return {
			success: `Agent ${deleteAgent.name} ${" "} ${
				deleteAgent.surname
			} has been deleted.`,
		};
	} catch (error) {
		return { error: `We coudln't delete agent ${error}`, status: 500 };
	}
}
