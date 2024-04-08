import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Links = [
  { label: "Home", href: "/" },
  { label: "Addresses", href: "/ipAddresses" },
];
