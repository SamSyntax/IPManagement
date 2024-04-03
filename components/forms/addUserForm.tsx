"use client";
// AddUserPopup component
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Define the type of the response data object
type UserDataResponse = {
  message: string;
  error?: string;
  simsId: string;
  region: string;
  type: string;
  address: string; // Include the 'error' property
};

const userInputSchema = z.object({
  simsId: z
    .string()
    .length(8, { message: "SIMSID must be exactly 8 characters long." }),
  type: z.enum(["P4", "P6"]),
  region: z.enum(["EMEA", "APAC", "AMERICAS"]),
});

interface AddUserPopupProps {
  onClose: () => void; // Function to close the popup
}

export default function AddUserPopup({ onClose }: AddUserPopupProps) {
  const form = useForm<z.infer<typeof userInputSchema>>({
    resolver: zodResolver(userInputSchema),
    defaultValues: {
      simsId: "",
      region: "EMEA",
      type: "P4",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof userInputSchema>) => {
    setSubmitting(true);
    try {
      const validation = userInputSchema.safeParse(data);

      if (!validation.success) {
        throw new Error("Invalid input");
      }

      const response = await axios.post<UserDataResponse>("/api/addUser", data);

      const res = response.data.message;
      console.log(response);

      setSuccessMessage(res.toString());
      setSuccess(true);
      setError(null);
    } catch (error: any) {
      console.error("Error adding user:", error);
      if (
        error.response &&
        error.response.data &&
        "error" in error.response.data
      ) {
        console.log(error.response.data.error);
        setError(error.response.data.error); // Set error message
      } else {
        setError("Failed to add user.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md z-10">
      <div className="bg-white p-8 rounded-lg">
        <h1 className="font-bold text-2xl mb-8">Add User</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4">User added successfully!</p>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start justify-center gap-12"
        >
          <Input placeholder="SIMSID" {...form.register("simsId")} />
          <select {...form.register("region")}>
            <option value="EMEA">EMEA</option>
            <option value="APAC">APAC</option>
            <option value="AMERICAS">AMERICAS</option>
          </select>
          <select {...form.register("type")}>
            <option value="P4">P4</option>
            <option value="P6">P6</option>
          </select>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
          <Button onClick={onClose}>Close</Button>
        </form>
        {success && <p>{successMessage}</p>}
      </div>
    </div>
  );
}
