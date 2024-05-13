import { prisma } from "@/lib/db";
import axios from "axios";

export const deleteIp = async (address: string) => {
	try {
		const response = await axios.post("/api/deleteIP", { address: address });
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
};

export const getIpById = async (id: string) => {
	try {
		const response = await prisma.iPAddress.findUnique({
			where: {
				id: id,
			},
			include: {
				user: true,
				action: true,
			},
		});
		return { ...response };
	} catch (error) {
		return new Response("Error fetching the IP", { status: 500 });
	}
};

export const getUserById = async (id: string) => {
	try {
		const response = await prisma.user.findUnique({
			where: {
				id: id,
			},
			include: {
				ipAddress: true,
				action: true,
			},
		});
		return response;
	} catch (error) {
		return new Response("Error fetching the IP", { status: 500 });
	}
};
