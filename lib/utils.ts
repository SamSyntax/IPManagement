import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as xlsx from "xlsx";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Links = [
  { label: "Users", href: "/" },
  { label: "Addresses", href: "/ipAddresses" },
  { label: "Add addresses", href: "/uploadExcel" },
];

export async function parseExcelData(filePath: string): Promise<any[]> {
  const workbook = xlsx.readFile("../uploads/users.xlsx");
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet);
  return data;
}