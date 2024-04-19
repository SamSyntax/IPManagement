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

import { toast } from "./ui/use-toast";
import axios from "axios";
import { useGlobalState } from "@/providers/global-state";

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
      ips.push(item.address);
    });
  }

  if (!bulk) {
    simsIds.push(simsId!);
  }

  const { setIsFetched } = useGlobalState();

  const handleDeleteManyUsers = async () => {
    try {
      setIsFetched(true);

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
    } finally {
      setIsFetched(false);
    }
  };

  const handleRelease = async () => {
    try {
      setIsFetched(true);

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
    } finally {
      setIsFetched(false);
    }
  };

  const handleDeleteIP = async () => {
    try {
      setIsFetched(true);

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
    } finally {
      setIsFetched(false);
    }
  };

  const handleDeleteManyIPs = async () => {
    try {
      setIsFetched(true);

      const response = await axios.post("/api/deleteManyAddresses", { ips });
      toast({
        title: "IP Addresses have been deleted!",
        description: `IP Addresses ${ips.join(", ")} have been deleted!`,
      });
    } catch (error: any) {
      console.error("Error releasing IP Address", error);
      toast({
        title: "Ughh, something went wrong!",
        description: `${error.response.data.error} `,
        variant: "destructive",
      });
    } finally {
      setIsFetched(false);
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
            {action === "delete" && type === "users" ? (
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                user(s): <b>{bulk ? simsIds.join(", ") : simsId}</b> from our
                VPN database and release IP Address: <b>{ips.join(", ")}</b>.
              </AlertDialogDescription>
            ) : action === "delete" && type === "ips" && !bulk ? (
              <AlertDialogDescription>
                This action cannot be undone. This will delete IP Address:{" "}
                <b>{ip}</b> from our database.
              </AlertDialogDescription>
            ) : action === "delete" && type === "ips" && target === "ip" ? (
              <AlertDialogDescription>
                This action cannot be undone. This will delete IP Addresses:{" "}
                <b>{ips.join(", ")}</b>
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
                  : action === "delete" && type === "ips" && !bulk
                  ? handleDeleteIP
                  : action === "delete" && type === "ips" && target === "ip"
                  ? handleDeleteManyIPs
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
