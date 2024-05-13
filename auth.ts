import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import NextAuth from "next-auth";
import { getUserById } from "./actions/data/user";
import prisma from "./prisma/db";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	callbacks: {
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}
			session.user.role = token.role as Role;
			token.exp = Math.floor(Date.now() / 1000) + 3600;

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.name = existingUser.name;
			token.surname = existingUser.surname;
			token.simsId = existingUser.simsId;
			token.role = existingUser.role;
			token.sub = existingUser.id;
			token.exp = Math.floor(Date.now() / 1000) + 10;

			return token;
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt", maxAge: 10 },

	...authConfig,
});
