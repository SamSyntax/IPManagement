"use client";
// AddUserPopup component
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

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

      const response = await axios.post<UserDataResponse>(
        "http://localhost:3000/api/addUser",
        data
      );

      const res = response.data.message;

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
        setError(error.response.data.error); // Set error message
      } else {
        setError("Failed to add user.");
      }
    } finally {
      setSubmitting(false);
      router.refresh();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("simsId", e.target.value.toUpperCase());
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 backdrop-blur-md z-10">
      <div className="bg-zinc-800 bg-opacity-50 p-16 rounded-lg min-w-[200px] h-[500px] flex flex-wrap flex-col items-baseline justify-center">
        <h1 className="font-bold text-2xl mb-8 text-center w-full">Add User</h1>
        {error && (
          <p className=" mb-4 text-wrap w-[250px] text-destructive">{error}</p>
        )}
        {success && !error && (
          <p className="text-green-500 mb-4">User added successfully!</p>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-start justify-center gap-6"
          >
            <FormField
              control={form.control}
              name="simsId"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />

                  <FormControl className="flex flex-col gap-2 bg-zinc-800">
                    <Input
                      placeholder="SIMSID"
                      {...field}
                      onChange={handleInputChange}
                      className="w-[280px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-end gap-2">
                <label className="flex items-center justify-center gap-2">
                  <input
                    type="radio"
                    value="EMEA"
                    {...form.register("region")}
                  />
                  EMEA
                </label>
                <label className="flex items-center justify-center gap-2">
                  <input
                    type="radio"
                    value="APAC"
                    {...form.register("region")}
                  />
                  APAC
                </label>
                <label className="flex items-center justify-center gap-2">
                  <input
                    type="radio"
                    value="AMERICAS"
                    {...form.register("region")}
                  />
                  AMERICAS
                </label>
              </div>
              <div className="flex gap-8 items-center justify-start">
                <label className="flex items-center justify-center gap-2">
                  <input type="radio" value="P4" {...form.register("type")} />
                  P4
                </label>
                <label className="flex items-center justify-center gap-2">
                  <input type="radio" value="P6" {...form.register("type")} />
                  P6
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="default" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </form>
        </Form>
        <div>
          {success && !error && <p className="text-wrap">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}
