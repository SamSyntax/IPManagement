"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { parseData } from "./data-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Vpn = {
  id: number;
  simsId: string;
  ip: string;
  type: "P4" | "P6";
  region: "EMEA" | "APAC" | "AMERICAS";
  toggleRowSelection: (simsId: string) => void;
};

export const columns: ColumnDef<Vpn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "simsId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1"
        >
          SIMSID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "ip",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1"
        >
          IP Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "ipAddress.type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "ipAddress.region",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1"
        >
          Region
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="ghost" onClick={() => deleteUser(row.original.simsId)}>
        Delete
      </Button>
    ),
  },
];

export const ipColumns: ColumnDef<Vpn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1"
        >
          IP Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "region",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1"
        >
          Region
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "simsId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1"
        >
          SIMSID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 ">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <span className="text-wrap max-w-18">
                Delete users <br />{" "}
                {parseData.map((simsId: string) => (
                  <div key={simsId} className="flex flex-col">
                    <span>
                      <b>{simsId}</b>
                    </span>
                  </div>
                ))}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 ">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => deleteUser(row.original.simsId)}>
              Delete User
            </DropdownMenuItem>
            {row.original.simsId && (
              <DropdownMenuItem
                onClick={() =>
                  assignNextFreeIp(
                    row.original.simsId,
                    row.original.type,
                    row.original.region
                  )
                }
              >
                Assign next free address of type {row.original.type} in region{" "}
                {row.original.region}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];

async function deleteUser(userId: string) {
  try {
    const response = await axios.post("/api/deleteUser", { simsId: userId });
    console.log(response.data); // Log the response data
    // Optionally, you can update the table data after successful deletion
    // For example, refetch the data or remove the deleted row from the table
  } catch (error) {
    console.error("Error deleting user:", error);
    // Handle error
  }
}

async function assignNextFreeIp(simsId: string, type: string, region: string) {
  try {
    const response = await axios.post("/api/nextFree", {
      simsId,
      type,
      region,
    });
    console.log(response.data); // Log the response data
    // Optionally, you can update the table data after successful assignment
    // For example, refetch the data or update the assigned IP address in the table
  } catch (error) {
    console.error("Error assigning next free IP:", error);
    // Handle error
  }
}


