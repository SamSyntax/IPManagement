"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DataTable, parseData } from "../Table/data-table";
import { columns, dataArr, ipColumns } from "../Table/column";
import { useRouter } from "next/navigation";

const UserSchema = z.object({
  simsId: z
    .string()
    .min(1, { message: "Enter at least one character." })
    .max(8, { message: "SIMSID can't be longer than 8 characters." }),
});

interface Props {
  endpoint: string;
  cols?: string;
  filterTarget: string;
  filterPlaceholder: string;
}

const Search = ({ endpoint, cols, filterTarget, filterPlaceholder }: Props) => {
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

  const router = useRouter();

  useEffect(() => {
    users();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const onSubmit = async (data: z.infer<typeof UserSchema>) => {
  //   setSubmitting(true);
  //   try {
  //     const validation = UserSchema.safeParse(data);

  //     if (!validation.success) {
  //       throw new Error("Invalid input");
  //     }

  //     setStartsWith(data.simsId);
  //     const response = await axios.post("/api/findUser", data);

  //     setSearchResults(response.data);
  //   } catch (error: any) {
  //     console.error("Error adding user:", error);
  //     if (
  //       error.response &&
  //       error.response.data &&
  //       "error" in error.response.data
  //     ) {
  //       setError(error.response.data.error); // Set error message
  //     } else {
  //       setError("Failed to add user.");
  //     }
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const users = async () => {
    try {
      setSearchResults([]);
      setUsersSubmitting(true);

      const res = await axios.get(endpoint);
      setSearchUsers(res.data);

      return res.data;
    } catch (error) {
      throw new Error("Failed to fetch users");
    } finally {
      setUsersSubmitting(false);
    }
  };

  const deleteManyUsers = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post("/api/deleteManyUsers", {
        simsIds: parseData,
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      throw new Error("Failed to delete users");
    } finally {
      setSubmitting(false);
      users();
    }
  };

  console.log(parseData);

  return (
    <div className="w-screen flex justify-center items-center flex-col gap-20 z-0">
      <div className="flex flex-col gap-2">
        <Button
          onClick={deleteManyUsers}
          disabled={submitting}
          variant="destructive"
          className="w-[100px]"
        >
          {submitting ? "Deleting" : "Delete"}
        </Button>
        <DataTable
          filterPlaceholder={filterPlaceholder}
          filterTarget={filterTarget}
          data={searchUsers}
          // @ts-ignore
          columns={cols === "ip" ? ipColumns : columns}
        />
      </div>
    </div>
  );
};

export default Search;
