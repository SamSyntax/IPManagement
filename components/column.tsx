"use client";

import { deleteManyUsers, deleteUser, releaseIp } from "@/actions/userActions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { parseData } from "./data-table";
import Dialog from "./Dialog";
import AddSheet from "./forms/addSheet";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Vpn = {
  [x: string]: any;
  address: string | undefined;
  ipAddress: any;
  id: number;
  simsId: string;
  ip: string;
  type: "P4" | "P6";
  region: "EMEA" | "APAC" | "AMERICAS" | "AUSTRALIA";
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
        onCheckedChange={(value: any) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => {
          row.toggleSelected(!!value);
        }}
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
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        <Link href={`/user/${row.original.id}`}>
          <span className="hover:text-muted-foreground transition-colors ease-in-out duration-300 rounded-md">
            {row.getValue("simsId")}
          </span>
        </Link>
      </div>
    ),
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
            <Dialog
              func={() => {
                deleteManyUsers(parseData.map((item: any) => item.simsId));
              }}
              title={parseData.length > 1 ? "Delete users" : "Delete user"}
              bulk={true}
              type="users"
              action="delete"
            />
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

            <AddSheet
              type="assign"
              isVisible={row.original.address !== null ? false : true}
              simsId={row.original.simsId}
            />

            {row.original.address === null && <DropdownMenuSeparator />}

            {row.original.address && (
              <Dialog
                action="assignNext"
                bulk={false}
                title={`Assign next free address of type ${row.original.ipAddress?.type}
                in region ${row.original.ipAddress?.region}`}
                type="users"
                simsId={row.original.simsId}
                ip={row.original.address}
                ipType={row.original.ipAddress?.type}
                region={row.original.ipAddress?.region}
                target="user"
              />
            )}
            {row.original.address && (
              <div>
                <Dialog
                  type="ips"
                  bulk={false}
                  ip={row.original.address}
                  title={`Release ${row.original.address}`}
                  simsId={row.original.simsId}
                  func={() => releaseIp(row.original.address!)}
                  action="release"
                />
                <DropdownMenuSeparator />
              </div>
            )}

            <Dialog
              func={() => {
                deleteUser(row.original.simsId);
              }}
              type="users"
              ip={row.original.ip}
              simsId={row.original.simsId}
              title={`Delete ${row.original.simsId}`}
              bulk={false}
              action="delete"
              target="user"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
    enableHiding: false,
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
    enableResizing: true,
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
    enableSorting: true,
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
    enableSorting: true,
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
    sortingFn: "text",
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
            <Dialog
              func={() => {
                deleteManyUsers(parseData.map((item: any) => item.simsId));
              }}
              title={
                parseData.length > 1 ? "Delete addresses" : "Delete address"
              }
              bulk={true}
              type="ips"
              action="delete"
              target="ip"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row }) => {
      console.log(row.original);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 ">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {row.original.simsId && (
              <div>
                <Dialog
                  action="assignNext"
                  bulk={false}
                  title={`Assign next free address of type ${row.original.type}
                  in region ${row.original.region}`}
                  type="users"
                  simsId={row.original.simsId}
                  ip={row.original.address}
                  ipType={row.original.type}
                  region={row.original.region}
                  target="user"
                />
                <DropdownMenuSeparator />
              </div>
            )}
            <Dialog
              func={() => {
                deleteUser(row.original.simsId);
              }}
              type="ips"
              ip={row.original.address}
              simsId={row.original.simsId}
              title={`Delete ${row.original.address}`}
              bulk={false}
              action="delete"
            />

            {row.original.simsId && (
              <Dialog
                type="users"
                bulk={false}
                ip={row.original.address}
                title={`Delete ${row.original.simsId}`}
                simsId={row.original.simsId}
                action="delete"
                func={() => deleteUser(row.original.simsId)}
                target="user"
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
  },
];

