import axios from "axios";

export async function deleteUser(userId: string) {
  try {
    const response = await axios.post("/api/deleteUser", { simsId: userId });
    console.log("action: ", response.data, response.status); // Log the response data
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

    console.log("action: ", response.status);
    return { ...response };
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}

export async function getAllUsers(endpoint: string) {
  try {
    const res = await axios.get(endpoint);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  } finally {
  }
}

export async function releaseIp(simsId: string) {
  try {
    if (!simsId) {
      throw new Error("simsId is required");
    }

    const response = await axios.post("/api/removeAddress", { simsId: simsId });

    console.log(response.data);
  } catch (error) {
    throw new Error("Failed to release ip");
  }
}
