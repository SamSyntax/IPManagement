"use server";
import { LoginSchema } from "@/lib/schemas/LoginSchema";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validation = LoginSchema.safeParse(values);

  if (!validation.success) {
    return {
      error: "Invalid data",
    };
  }
  return {
    success: "Logged in",
  };
};
