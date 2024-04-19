import axios from "axios";

export const deleteIp = async (address: string) => {
  try {
    const response = await axios.post("/api/deleteIP", { address: address });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
