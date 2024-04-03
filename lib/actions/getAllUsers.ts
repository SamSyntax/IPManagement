import { Payment } from "@/components/Table/column";
import axios from "axios";

export async function getAllUsers(): Promise<Payment[]> {
  try {
    const res = await axios.get("http://localhost:3000/api/getAllUsers");
    console.log("aaa", res.data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  } finally {
  }
}
