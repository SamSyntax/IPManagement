"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import { DataTable } from "../Table/data-table";
import { columns } from "../Table/column";

const UserSchema = z.object({
  simsId: z
    .string()
    .min(1, { message: "Enter at least one character." })
    .max(8, { message: "SIMSID can't be longer than 8 characters." }),
});

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [startsWith, setStartsWith] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [usersSubmitting, setUsersSubmitting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      simsId: "",
    },
  });

  useEffect(() => {
    users();
  }, []);

  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    setSubmitting(true);
    try {
      const validation = UserSchema.safeParse(data);

      if (!validation.success) {
        throw new Error("Invalid input");
      }

      setStartsWith(data.simsId);
      console.log(startsWith);
      const response = await axios.post("/api/findUser", data);

      const res = response.data.message;
      setSearchResults(response.data);
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
      console.log(searchResults);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("simsId", e.target.value.toUpperCase());
  };
  const users = async () => {
    try {
      setSearchResults([]);
      setUsersSubmitting(true);

      const res = await axios.get("/api/getIps");
      console.log("aaa", res.data);
      setSearchUsers(res.data);
      return res.data;
    } catch (error) {
      throw new Error("Failed to fetch users");
    } finally {
      setUsersSubmitting(false);
    }
  };

  return (
    <div className="w-screen flex justify-center items-center flex-col gap-20 z-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start justify-center gap-4"
        >
          <FormField
            control={form.control}
            name="simsId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormLabel className="flex items-start justify-center flex-col gap-4">
                    <Input
                      className="w-[280px]"
                      placeholder="SIMSID"
                      {...field}
                      onChange={handleInputChange}
                    />
                  </FormLabel>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
          <Button onClick={users} disabled={usersSubmitting} variant="ghost">
            {usersSubmitting ? "Fetching..." : "Fetch All Users"}
          </Button>
        </form>
      </Form>
      {searchResults.length === 0 && !usersSubmitting ? (
        <div>
          <DataTable data={searchUsers} columns={columns} />
        </div>
      ) : (
        <div>
          <DataTable data={searchResults} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default Search;
