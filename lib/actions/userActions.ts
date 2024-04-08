import axios from "axios";
import { Vpn } from "@/components/table/column";

export async function deleteUser(userId: string) {
  try {
    const response = await axios.post("/api/deleteUser", { simsId: userId });
    console.log(response.data); // Log the response data
    // Optionally, you can update the table data after successful deletion
    // For example, refetch the data or remove the deleted row from the table
  } catch (error) {
    console.error("Error deleting user:", error);
    // Handle error
  }
}

export async function assignNextFreeIp(
  simsId: string,
  type: string,
  region: string
) {
  try {
    const response = await axios.post("/api/nextFree", {
      simsId,
      type,
      region,
    });
    console.log(response.data); // Log the response data
    // Optionally, you can update the table data after successful assignment
    // For example, refetch the data or update the assigned IP address in the table
  } catch (error) {
    console.error("Error assigning next free IP:", error);
    // Handle error
  }
}

export async function deleteManyUsers(simsIds: string[]) {
  try {
    const response = await axios.post("/api/deleteManyUsers", { simsIds });

    console.log(response.data); // Log the response data
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}

export async function getAllUsers(): Promise<Vpn[]> {
  try {
    const res = await axios.get("/api/getAllUsers");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  } finally {
  }
}
