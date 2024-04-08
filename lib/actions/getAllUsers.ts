import { Vpn } from "@/components/table/column";
import axios from "axios";

export async function getAllUsers(): Promise<Vpn[]> {
  try {
    const res = await axios.get("/api/getAllUsers");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  } finally {
  }
}
