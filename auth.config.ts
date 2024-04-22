import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/schemas/LoginSchema";
import { getUserBySimsId } from "./actions/data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validation = LoginSchema.safeParse(credentials);

        if (validation.success) {
          const { simsId, password } = validation.data;

          const user = await getUserBySimsId(simsId);

          if (!user || !user.password) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
