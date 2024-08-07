import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import { useGlobalState } from "@/providers/global-state";
import React from "react";
import MessageCopy from "../MessageCopy";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

// Define the type of the response data object
type UserDataResponse = {
  message: string;
  workNotes: string;
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
  region: z.enum(["EMEA", "APAC", "AMERICAS", "AUSTRALIA"]),
});

interface Props {
  type: "add" | "assign";
  simsId?: string;
  isVisible?: boolean;
}

const AddSheet = ({ type, simsId, isVisible }: Props) => {
  const form = useForm<z.infer<typeof userInputSchema>>({
    resolver: zodResolver(userInputSchema),
    defaultValues: {
      simsId: type === "assign" ? simsId : "",
      region: "EMEA",
      type: "P4",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [workNotesMessage, setWorkNotesMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);

  const { setIsFetched } = useGlobalState();

  const onSubmit = async (data: z.infer<typeof userInputSchema>) => {
    setSubmitting(true);
    setSuccess(false);
    setUserData(null);
    try {
      setIsFetched(true);
      const validation = userInputSchema.safeParse(data);

      if (!validation.success) {
        throw new Error("Invalid input");
      }

      const response = await axios.post<UserDataResponse>("/api/addUser", data);

      const res = response.data;

      setSuccessMessage(res.message.toString());
      setWorkNotesMessage(res.workNotes.toString());
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
      setIsFetched(false);
      setSubmitting(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("simsId", e.target.value.toUpperCase());
  };

  return (
    <div>
      <Sheet>
        {type === "add" ? (
          <SheetTrigger asChild>
            <Button variant="outline">+ Add User</Button>
          </SheetTrigger>
        ) : (
          <SheetTrigger className={isVisible ? "flex" : "hidden"} asChild>
            <p className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
              Assign Address
            </p>
          </SheetTrigger>
        )}
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
                          {type === "add" ? (
                            <Input
                              placeholder="SIMSID"
                              {...field}
                              onChange={handleInputChange}
                              className="w-[280px]"
                            />
                          ) : (
                            <Input
                              placeholder={simsId}
                              {...field}
                              className="w-[280px]"
                              disabled={true}
                            />
                          )}
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
                      <label className="flex items-center justify-center gap-2">
                        <input
                          type="radio"
                          value="AUSTRALIA"
                          {...form.register("region")}
                        />
                        AUSTRALIA
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
              {error && <MessageCopy content={error!} description="Message" />}
              {success && !error && (
                <p className="text-green-500 mb-4">User added successfully!</p>
              )}
              <div className="">
                {success && !error && (
                  <div className="flex flex-col gap-4">
                    <MessageCopy
                      content={workNotesMessage!}
                      description="Paste to the work notes"
                    />
                    <MessageCopy
                      content={successMessage!}
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
