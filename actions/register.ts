"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/lib/schemas/RegisterSchema";
import { getUserByEmail, getUserBySimsId } from "./data/user";



export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const validation = RegisterSchema.safeParse(data);
  if (!validation.success) {
    return { error: "Invalid data" };
  }

  const { email, password, name, surname, simsId } = validation.data;

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
    },
  });
  return { success: "Account created!" };
};
