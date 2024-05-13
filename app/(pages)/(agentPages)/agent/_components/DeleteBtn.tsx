"use client";

import { deleteAgent } from "@/actions/data/agent";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Trash } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
interface Props {
  id: string;
  session: Session;
  simsId: string;
}

const DeleteBtn = ({ id, session, simsId }: Props) => {
  const router = useRouter();
  const delAgent = async () => {
    try {
      const res = await deleteAgent(id, session);
      console.log(res);
      toast({
        title: "Agent has been deleted",
        description: `Agent ${simsId} has been deleted successfully.`,
      });
      router.push("/agents");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"default"} size={"icon"}>
            <Trash size={15} />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove agent <b>{simsId}</b> and delete all the
              actions associated with this account
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={delAgent}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteBtn;
