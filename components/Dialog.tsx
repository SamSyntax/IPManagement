import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { parseData } from "./data-table";

interface Props {
  simsId?: string;
  ip?: string;
  title: string;
  bulk: boolean;
  type: "users" | "ips";
  func: () => void;
}

const Dialog = ({ simsId, ip, func, title, bulk, type }: Props) => {
  const simsIds: string[] = [];
  const ips: string[] = [];

  if (type === "ips") {
    parseData.map((item: any) => {
      simsIds.push(item.simsId);
      ips.push(item.address);
    });
  } else {
    parseData.map((item: any) => {
      simsIds.push(item.simsId);
      ips.push(item.ip);
    });
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
          {title}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              user(s): <b>{bulk ? simsIds.join(", ") : simsId}</b> from our VPN
              database and release IP Address:{" "}
              <b>{bulk ? ips.join(", ") : ip}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={func}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dialog;
