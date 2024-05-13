import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
	try {
		const user = await prisma.agent.findUnique({
			where: {
				email: email,
			},
		});
		return user;
	} catch {
		return null;
	}
};

export const getUserBySimsId = async (simsId: string) => {
	try {
		const user = await prisma.agent.findUnique({
			where: { simsId: simsId },
		});
		return user;
	} catch {
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await prisma.agent.findUnique({
			where: { id: id },

			include: {
				action: true,
			},
		});

		return user;
	} catch {
		return null;
	}
};

export async function getActionByAgentId(id: string) {
	try {
		const action = await prisma.action.findMany({
			where: {
				agentId: id,
			},
			include: {
				agent: true,
				ipAddress: true,
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return action;
	} catch (error) {
		throw new Error("Failed to fetch actions");
	}
}

export async function getActionByAddressId(id: string) {
	try {
		const action = await prisma.action.findMany({
			where: {
				addressId: id,
			},
			include: {
				agent: true,
				ipAddress: true,
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return action;
	} catch (error) {
		throw new Error("Failed to fetch actions");
	}
}

export async function getActionByUserId(id: string) {
	try {
		const action = await prisma.action.findMany({
			where: {
				userId: id,
			},
			include: {
				agent: true,
				ipAddress: true,
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return action;
	} catch (error) {
		throw new Error("Failed to fetch actions");
	}
}