"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "../table/data-table";
import { columns, ipColumns } from "../table/column";

interface Props {
  endpoint: string;
  cols?: string;
  filterTarget: string;
  filterPlaceholder: string;
}

const Search = ({ endpoint, cols, filterTarget, filterPlaceholder }: Props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);

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

  return (
    <div className="w-screen flex justify-center items-center flex-col gap-20 z-0">
      <div className="flex flex-col gap-2">
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
