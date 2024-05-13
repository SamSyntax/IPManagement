"use client";

import { Button } from "@/components/ui/button";
import { ActionType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Action = {
  ipAddress: { address: string; id: string };
  actionType: ActionType;
  createdAt: Date;
  message: string;
  user: {
    simsId: string;
    id: string;
  };
  agent: {
    id: string;
    simsId: string;
  };
};

export const columns: ColumnDef<Action>[] = [
  {
    accessorKey: "actionType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1">
          Action Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "message",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1">
          Message
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
          className="flex items-center justify-start p-1">
          IP Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.original.ipAddress !== null) {
        return (
          <Link
            className="hover:text-muted-foreground transition-colors ease-in-out duration-300"
            href={`/ipAddress/${row.original.ipAddress.id}`}>
            {row.original.ipAddress.address}
          </Link>
        );
      } else {
        return null;
      }
    },
  },
  {
    accessorKey: "agent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1">
          Modified by
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/agent/${row.original.agent.id}`}
          className="hover:text-muted-foreground transition-colors ease-in-out duration-300">
          {row.original.agent.simsId}
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-1">
          Modified at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: Date = new Date(row.getValue("createdAt"));
      return <span>{date.toUTCString()}</span>;
    },
  },
];
