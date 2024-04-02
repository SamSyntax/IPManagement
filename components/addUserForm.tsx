"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { type } from "os";

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

export default function AddUser() {
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
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-2xl mb-8">Add User</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && (
        <p className="text-green-500 mb-4">User added successfully!</p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start justify-center gap-12"
        >
          <FormField
            control={form.control}
            name="simsId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="SIMSID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem className="flex items-start justify-center flex-col">
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <div className="flex justify-center items-center gap-4">
                    <label className="flex items-center justify-center gap-1">
                      <input
                        type="radio"
                        {...field}
                        value="EMEA"
                        checked={field.value === "EMEA"}
                      />{" "}
                      EMEA
                    </label>
                    <label className="flex items-center justify-center gap-1">
                      <input
                        type="radio"
                        {...field}
                        value="APAC"
                        checked={field.value === "APAC"}
                      />{" "}
                      APAC
                    </label>
                    <label className="flex items-center justify-center gap-1">
                      <input
                        type="radio"
                        {...field}
                        value="AMERICAS"
                        checked={field.value === "AMERICAS"}
                      />{" "}
                      AMERICAS
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex items-start justify-center flex-col">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center gap-4">
                    <label className="flex items-center justify-center gap-1">
                      <input
                        type="radio"
                        {...field}
                        value="P6"
                        checked={field.value === "P6"}
                      />{" "}
                      P6
                    </label>
                    <label className="flex items-center justify-center gap-1">
                      <input
                        type="radio"
                        {...field}
                        value="P4"
                        checked={field.value === "P4"}
                      />{" "}
                      P4
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
      {success && <p>{successMessage}</p>}
    </div>
  );
}
