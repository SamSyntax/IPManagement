import { clsx, type ClassValue } from "clsx";
import { SessionOptions } from "iron-session";
import { EarthLock, UploadCloud, UserCog, UsersRound } from "lucide-react";
import { twMerge } from "tailwind-merge";
import * as xlsx from "xlsx";
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const Links = [
	{ label: "Users", href: "/", accessLevel: "AGENT", icon: () => UsersRound },
	{
		label: "Addresses",
		href: "/ipAddresses",
		accessLevel: "AGENT",
		icon: () => EarthLock,
	},
	{
		label: "Agents",
		href: "/agents",
		accessLevel: "USER_ADMIN",
		icon: () => UserCog,
	},
	{
		label: "Upload",
		href: "/uploadExcel",
		accessLevel: "GLOBAL_ADMIN",
		icon: () => UploadCloud,
	},
];

export async function parseExcelData(filePath: string): Promise<any[]> {
	const workbook = xlsx.readFile("../uploads/users.xlsx");
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];
	const data = xlsx.utils.sheet_to_json(worksheet);
	return data;
}

export const formDate = (inputDate: Date) => {
	const date = new Date(inputDate);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export interface SessionData {
	userId?: string;
	name?: string;
	surname?: string;
	role?: string | string[];
	branch?: string;
	isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
	isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
	password: process.env.SECRET_KEY!,
	cookieName: "ip-management-schenker-session",
	cookieOptions: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	},
};
