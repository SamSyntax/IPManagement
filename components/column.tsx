"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { parseData } from "./data-table";
import {
  assignNextFreeIp,
  deleteManyUsers,
  deleteUser,
  releaseIp,
} from "@/lib/actions/userActions";
import Dialog from "../Dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Vpn = {
  ipAddress: any;
  id: number;
  simsId: string;
  ip: string;
  type: "P4" | "P6";
  region: "EMEA" | "APAC" | "AMERICAS";
  toggleRowSelection: (simsId: string) => void;
};

export const userColumns: ColumnDef<Vpn>[] = [
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
    accessorKey: "ipAddress.address",
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
    header: ({ table }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 "
              disabled={
                table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
                  ? false
                  : true
              }
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => deleteManyUsers(parseData)}>
              <div className="text-wrap max-w-18 flex flex-col gap-1">
                <span className="text-red-600">Delete users</span> <br />{" "}
                {parseData.map((simsId: string) => (
                  <div key={simsId} className="flex flex-col">
                    <span>
                      <b>{simsId}</b>
                    </span>
                  </div>
                ))}
              </div>
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
            <Dialog
              func={() => {
                deleteUser(row.original.simsId);
              }}
              ip={row.original.ip}
              simsId={row.original.simsId}
              title={`Delete ${row.original.simsId}`}
            />

            {row.original.simsId && (
              <DropdownMenuItem
                onClick={() =>
                  assignNextFreeIp(
                    row.original.simsId,
                    row.original.ipAddress.type,
                    row.original.ipAddress.region
                  )
                }
              >
                {row.original.ipAddress
                  ? ` Assign next free address of type ${row.original.ipAddress.type}
                in region ${row.original.ipAddress.region}`
                  : null}
              </DropdownMenuItem>
            )}
            {row.original.ip ? (
              <DropdownMenuItem onClick={() => releaseIp(row.original.simsId)}>
                Release IP Address {row.original.ip}
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
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
    header: ({ table }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 "
              disabled={
                table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
                  ? false
                  : true
              }
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => deleteManyUsers(parseData)}>
              <div className="text-wrap max-w-18 flex flex-col gap-1">
                <span className="text-red-600">Delete users</span> <br />{" "}
                {parseData.map((simsId: string) => (
                  <div key={simsId} className="flex flex-col">
                    <span>
                      <b>{simsId}</b>
                    </span>
                  </div>
                ))}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem></DropdownMenuItem>
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
              Delete User {row.original.simsId}
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
