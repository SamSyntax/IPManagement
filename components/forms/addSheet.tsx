import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

import React from "react";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import MessageCopy from "../MessageCopy";

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
    .regex(/^[a-zA-Z0-9]+$/, "No special characters are allowed")
    .length(8, { message: "SIMSID must be exactly 8 characters long." }),
  type: z.enum(["P4", "P6"]),
  region: z.enum(["EMEA", "APAC", "AMERICAS"]),
});

const AddSheet = ({
  onCreation,
}: {
  onCreation: (endpoint: string) => void;
}) => {
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
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);

  const onSubmit = async (data: z.infer<typeof userInputSchema>) => {
    setSubmitting(true);
    setSuccess(false);
    setUserData(null);
    try {
      const validation = userInputSchema.safeParse(data);

      if (!validation.success) {
        throw new Error("Invalid input");
      }

      const response = await axios.post<UserDataResponse>("/api/addUser", data);

      const res = response.data.message;

      setSuccessMessage(res.toString());
      setSuccess(true);

      if (response.status === 201) {
        toast({
          title: "Address assigned!",
          description: `${response.data.message}`,
        });
      } else {
        toast({
          title: "User added!",
          description: `${response.data.message}`,
        });
      }

      setError(null);
      setUserData(data);
    } catch (error: any) {
      console.error("Error adding user:", error);
      if (
        error.response &&
        error.response.data &&
        "error" in error.response.data
      ) {
        setError(error.response.data.error); // Set error message
        toast({
          title: "Ughh, something went wrong!",
          description: `${error.response.data.error}`,
          variant: "destructive",
          action: <ToastAction altText="Try again">Close</ToastAction>,
        });
      } else {
        setError("Failed to add user.");
        toast({
          title: "Ughh something went wrong!",
          description: `${error}`,
          variant: "destructive",
          action: <ToastAction altText="Try again">Close</ToastAction>,
        });
      }
    } finally {
      onCreation("api/getAllUsers");

      setSubmitting(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("simsId", e.target.value.toUpperCase());
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">+ Add User</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add User</SheetTitle>
            <SheetDescription>
              {" "}
              Add user to the database and assign an IP Address to him. If the
              user already exists in the the database IP Address will be
              assigned to him based on the provided requirements.
            </SheetDescription>

            <SheetDescription>
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
                        <input
                          type="radio"
                          value="P4"
                          {...form.register("type")}
                        />
                        P4
                      </label>
                      <label className="flex items-center justify-center gap-2">
                        <input
                          type="radio"
                          value="P6"
                          {...form.register("type")}
                        />
                        P6
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </SheetDescription>

            <div className="flex flex-col gap-4 pt-2">
              {error && (
                <MessageCopy
                  content={successMessage!}
                  description="Paste to the work notes"
                />
              )}
              {success && !error && (
                <p className="text-green-500 mb-4">User added successfully!</p>
              )}
              <div className="">
                {success && !error && (
                  <div className="flex flex-col gap-4">
                    <MessageCopy
                      content={successMessage!}
                      description="Paste to the work notes"
                    />
                    <MessageCopy
                      content={`User ${userData.simsId}`}
                      description="Paste to the resolution notes"
                    />
                  </div>
                )}
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddSheet;
