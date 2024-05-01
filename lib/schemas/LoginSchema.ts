import * as z from "zod";

export const LoginSchema = z.object({
  simsId: z
    .string()
    .length(8, { message: "SIMSID must be exactly 8 characters long." })
    .regex(/^[a-zA-Z0-9]+$/, "No special characters are allowed"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});
