import axios from "axios";

export const deleteIp = async (address: string) => {
  try {
    const response = await axios.post("/api/deleteIP", { address: address });
    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};
