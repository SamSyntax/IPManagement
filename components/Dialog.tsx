import { parseData } from "./data-table";
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

import { useGlobalState } from "@/providers/global-state";
import axios from "axios";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "./ui/use-toast";

interface Props {
  simsId?: string;
  ip?: string;
  ipType?: string;
  region?: string;
  title: string;
  bulk: boolean;
  type: "users" | "ips";
  action: "delete" | "release" | "assignNext";
  target?: "user" | "ip";
  func?: ({ ...props }) => void;
}

const Dialog = ({
  simsId,
  ip,
  title,
  bulk,
  type,
  action,
  target,
  region,
  func,
  ipType,
}: Props) => {
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

  const handleAssignNext = async () => {
    try {
      setIsFetched(true);
      const response = await axios.post("/api/nextFree", {
        simsId: simsId,
        type: ipType,
        region: region,
      });
      toast({
        title: "New IP Address has been assigned!",
        description: `${response.data.message}`,
      });
    } catch (error: any) {
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
    <>
      <AlertDialog>
        {action === "delete" ? (
          <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-red-600      transition-colors focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
            {title}
          </AlertDialogTrigger>
        ) : (
          <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
            {title}
          </AlertDialogTrigger>
        )}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <ScrollArea className="max-h-[600px]">
              {action === "delete" && type === "users" ? (
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  user(s): <b>{bulk ? simsIds.join(", ") : simsId}</b> from our
                  VPN database.
                </AlertDialogDescription>
              ) : action === "delete" &&
                type === "ips" &&
                !bulk &&
                target !== "user" ? (
                <AlertDialogDescription>
                  This action cannot be undone. This will delete IP Address:{" "}
                  <b>{ip}</b> from our database.
                </AlertDialogDescription>
              ) : action === "delete" && type === "ips" && target === "ip" ? (
                <AlertDialogDescription>
                  This action cannot be undone. This will delete IP Addresses:{" "}
                  <b>{ips.join(", ")}</b>
                </AlertDialogDescription>
              ) : action === "assignNext" &&
                !bulk &&
                type === "users" &&
                target === "user" ? (
                <AlertDialogDescription>
                  This action will assign next free <b>{ipType}</b> IP Address
                  from region <b>{region}</b> to <b>{simsId}</b>
                </AlertDialogDescription>
              ) : action === "delete" &&
                type === "ips" &&
                !bulk &&
                target === "user" ? (
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  user(s): <b>{bulk ? simsIds.join(", ") : simsId}</b> from our
                  VPN database.
                </AlertDialogDescription>
              ) : (
                <AlertDialogDescription>
                  This action cannot be undonesdasdas. This will release IP
                  Address: <b>{ip}</b>
                </AlertDialogDescription>
              )}
            </ScrollArea>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={
                action === "delete" && type === "users"
                  ? handleDeleteManyUsers
                  : action === "release" && type === "users"
                  ? handleRelease
                  : action === "delete" &&
                    type === "ips" &&
                    !bulk &&
                    target !== "user"
                  ? handleDeleteIP
                  : action === "delete" && type === "ips" && target === "ip"
                  ? handleDeleteManyIPs
                  : action === "assignNext" &&
                    !bulk &&
                    type === "users" &&
                    target === "user"
                  ? handleAssignNext
                  : action === "delete" &&
                    type === "ips" &&
                    !bulk &&
                    target === "user"
                  ? handleDeleteManyUsers
                  : handleRelease
              }>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Dialog;
