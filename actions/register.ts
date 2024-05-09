"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { prisma } from "@/lib/db";
import { ModifySchema } from "@/lib/schemas/ModifySchema";
import { RegisterSchema } from "@/lib/schemas/RegisterSchema";
import { Agent, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getUserByEmail, getUserBySimsId } from "./data/user";

export const modifyAgent = async (
	data: z.infer<typeof ModifySchema>,
	requestor: Agent
) => {
	const validation = ModifySchema.safeParse(data);

	if (!validation.success) {
		return { error: "Invalid data" };
	}

	const { email, name, surname, simsId, role } = validation.data;

	const agent = await prisma.agent.findUnique({
		where: {
			simsId: simsId,
		},
	});

	const requestorAgent = await prisma.agent.findUnique({
		where: {
			id: requestor.id,
		},
	});

	if (!requestorAgent) {
		return {
			error: "You have to be logged in as an Agent!",
		};
	}

	if (!agent) {
		return {
			error: "Agent doesn't exist.",
		};
	}

	if (
		requestor.role !== "USER_ADMIN" &&
		requestor.role !== "GLOBAL_ADMIN" &&
		requestor.id !== agent?.id
	) {
		return { error: "You don't have permission to modify agent data." };
	}

	if (requestor.role !== "GLOBAL_ADMIN" && role === "GLOBAL_ADMIN") {
		return { error: "You don't have permission to assign GLOBAL_ADMIN role." };
	} else if (
		requestor.role !== "GLOBAL_ADMIN" &&
		requestor.role !== "USER_ADMIN" &&
		role === "USER_ADMIN"
	) {
		return {
			error: "You don't have permission to assign USER_ADMIN role.",
		};
	} else if (
		requestor.role !== "GLOBAL_ADMIN" &&
		agent?.role === "GLOBAL_ADMIN"
	) {
		return {
			error: "You don't have permission to modify GLOBAL_ADMIN profile.",
		};
	}

	try {
		const res = await prisma.agent.update({
			where: {
				id: agent?.id,
			},

			data: {
				email: email,
				name: name,
				surname: surname,
				simsId: simsId,
				role: role,
			},
		});

		await prisma.action.create({
			data: {
				message: `Modyfing agent ${agent.name} ${" "} ${agent.surname}, ${
					agent.simsId
				}`,
				actionType: "CREATE",

				agentId: requestorAgent.id,
			},
		});
		console.log(res);
		revalidatePath(`/agent/${agent.id}`);
		return { success: "Profile modified!" };
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong" + error };
	}
};

export const register = async (
	data: z.infer<typeof RegisterSchema>,
	creatorRole?: Role
) => {
	const validation = RegisterSchema.safeParse(data);
	if (!validation.success) {
		return { error: "Invalid data" };
	}

	const { email, password, name, surname, simsId, role } = validation.data;

	if (creatorRole !== "USER_ADMIN" && creatorRole !== "GLOBAL_ADMIN") {
		return { error: "You don't have permission to add a new Agent." };
	}

	if (role === "GLOBAL_ADMIN" && creatorRole !== "GLOBAL_ADMIN") {
		return {
			error: "You don't have permission to grant the GLOBAL_ADMIN role.",
		};
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const existingSimsId = await getUserBySimsId(simsId);

	if (existingSimsId) {
		return { error: "Agent with provided SIMSID already exists" };
	}

	const existingEmail = await getUserByEmail(email);

	if (existingEmail) {
		return { error: "Agent with provided email address already exists" };
	}

	await prisma.agent.create({
		data: {
			email: email,
			name: name,
			surname: surname,
			password: hashedPassword,
			simsId: simsId,
			role: role,
		},
	});

	revalidatePath("/agents");
	return { success: "Account created!" };
};
