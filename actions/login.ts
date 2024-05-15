"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/schemas/LoginSchema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validation = LoginSchema.safeParse(values);

	if (!validation.success) {
		return {
			error: "Invalid data",
		};
	}
	const { simsId, password } = validation.data;

	try {
		await signIn("credentials", {
			simsId,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
		return { success: "ok" };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials" };

				default:
					return { error: error.message };
			}
		}
		throw error;
	}
};
