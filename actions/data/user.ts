import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    });

    return user;
  } catch {
    return null;
  }
};
