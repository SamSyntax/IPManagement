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
import { useRouter } from "next/navigation";

import { toast } from "./ui/use-toast";
import axios from "axios";
import { deleteIp } from "@/lib/actions/ipActions";

interface Props {
  simsId?: string;
  ip?: string;
  title: string;
  bulk: boolean;
  type: "users" | "ips";
  action: "delete" | "release";
  target?: "user" | "ip";
  func: ({ ...props }) => void;
}

const Dialog = ({ simsId, ip, title, bulk, type, action, target }: Props) => {
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

  if (!bulk) {
    simsIds.push(simsId!);
  }

  const handleDeleteManyUsers = async () => {
    try {
      const response = await axios.post("/api/deleteManyUsers", { simsIds });

      toast({
        title: "Users have been deleted",
        description:
          simsIds.length > 1 && bulk
            ? `Users ${simsIds.join(", ")} have been deleted`
            : `User ${simsId} has been deleted`,
      });
    } catch (error: any) {
      toast({
        title: "Ughh, something went wrong!",
        description: `${error!.response.data.error}`,
        variant: "destructive",
      });
    }
  };

  const handleRelease = async () => {
    try {
      const response = await axios.post("/api/removeAddress", {
        simsId: simsId,
      });
      toast({
        title: "IP Address has been released",
        description: `IP Address ${ip} has been released`,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error releasing IP Address", error);
      toast({
        title: "Ughh, something went wrong!",
        description: `${error.response.data.error} `,
        variant: "destructive",
      });
    }
  };

  const handleDeleteIP = async () => {
    try {
      const response = await axios.post("/api/deleteAddress", { address: ip });
      toast({
        title: "IP Address has been deleted",
        description: `IP Address ${ip} has been deleted`,
      });
      return response.data;
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Ughh, something went wrong!",
        description: `${error.response.data.error} `,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
          {title}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            {action === "delete" && target === "user" ? (
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                user(s): <b>{bulk ? simsIds.join(", ") : simsId}</b> from our
                VPN database and release IP Address:{" "}
                <b>{bulk ? ips.join(", ") : ip}</b>.
              </AlertDialogDescription>
            ) : action === "delete" && type === "ips" ? (
              <AlertDialogDescription>
                This action cannot be undone. This will delete IP Address:{" "}
                <b>{ip}</b> from our database.
              </AlertDialogDescription>
            ) : (
              <AlertDialogDescription>
                This action cannot be undone. This will release IP Address:{" "}
                <b>{ip}</b>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={
                action === "delete" && type === "users"
                  ? handleDeleteManyUsers
                  : action === "release" && type === "users"
                  ? handleRelease
                  : action === "delete" && type === "ips"
                  ? handleDeleteIP
                  : handleRelease
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dialog;
