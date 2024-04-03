import React from "react";
import { columns, Payment } from "./column";
import axios from "axios";
import { DataTable } from "./data-table";
import { getAllUsers } from "@/lib/actions/getAllUsers";

const Table = async () => {
  const data = await getAllUsers();

  return (
    <div>
      {" "}
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default Table;
