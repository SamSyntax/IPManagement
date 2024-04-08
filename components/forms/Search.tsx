"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DataTable } from "../table/data-table";
import { columns, ipColumns } from "../table/column";

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
  // const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    users();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // const deleteManyUsers = async () => {
  //   try {
  //     setSubmitting(true);
  //     const res = await axios.post("/api/deleteManyUsers", {
  //       simsIds: parseData,
  //     });
  //     console.log(res.data);
  //     return res.data;
  //   } catch (error) {
  //     throw new Error("Failed to delete users");
  //   } finally {
  //     setSubmitting(false);
  //     users();
  //   }
  // };

  return (
    <div className="w-screen flex justify-center items-center flex-col gap-20 z-0">
      <div className="flex flex-col gap-2">
        {/* <Button
          onClick={deleteManyUsers}
          disabled={submitting}
          variant="destructive"
          className="w-[100px] bg-destructive"
        >
          {submitting ? "Deleting" : "Delete"}
        </Button> */}
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
