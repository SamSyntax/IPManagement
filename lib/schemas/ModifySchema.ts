import { z } from "zod";

export const ModifySchema = z.object({
	name: z
		.string()
		.min(1, { message: "Name must be at least one character long." }),
	surname: z
		.string()
		.min(1, { message: "Surname must be at least one character long." }),
	simsId: z
		.string()
		.length(8, { message: "SIMSID must be exactly 8 characters long." })
		.regex(/^[a-zA-Z0-9]+$/, "No special characters are allowed"),
	email: z.string().email({ message: "Invalid email address." }),

	role: z.enum(["AGENT", "USER_ADMIN", "GLOBAL_ADMIN"]),
});
