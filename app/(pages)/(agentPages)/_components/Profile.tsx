import { getActionByAgentId } from "@/actions/data/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formDate } from "@/lib/utils";
import { Role } from "@prisma/client";
import { CalendarCheck, Mail, UserCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

interface Props {
  name: string;
  surname: string;
  simsId: string;
  createdAt: string;
  role: Role;
  id: string;
  email: string;
}
//
const Profile = async ({
  name,
  surname,
  simsId,
  createdAt,
  role,
  id,
  email,
}: Props) => {
  const fetchActions = async () => await getActionByAgentId(id);
  fetchActions();
  revalidatePath;

  const actions: any = await fetchActions();

  return (
    <div className=" w-[90vw] border border-muted flex flex-col h-screen  ">
      <div className="flex-1 h-[50vh] border-b border-muted p-8  ">
        <div className="flex flex-col items-start gap-10 justify-center">
          <div className="flex gap-4 items-center ">
            <div className="flex">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@dbschenker"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">
                {name} {surname}
              </h1>
              <Badge
                className="flex items-center justify-center p-2 rounded-sm"
                variant={"outline"}>
                {role}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <Mail />
            <p className="text-lg text-muted-foreground font-bold">{email}</p>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <UserCircle />
            <p className="text-lg text-muted-foreground font-bold">{simsId}</p>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <CalendarCheck />
            <p className="text-lg text-muted-foreground font-bold">
              {createdAt}
            </p>
          </div>
        </div>
      </div>
      <div className="h-[50vh] w-[90vw] flex-1 ">
        <ScrollArea className="h-[50vh] w-[90vw]">
          {actions.length < 1 ? (
            <div className="w-[90vw] h-[50vh] flex items-center justify-center">
              <h1 className="text-xl font-medium">No actions found!</h1>
            </div>
          ) : (
            <Table>
              <TableHeader className="h-16">
                <TableRow>
                  <TableHead>Action Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>User SIMSID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions!.map((action: any) => {
                  return (
                    <TableRow key={action.id} className="">
                      <TableCell className="text-wrap p-4">
                        {action.actionType}
                      </TableCell>
                      <TableCell className="text-wrap p-4">
                        {action.addressId
                          ? action.ipAddress?.address
                          : "No IP Address ID"}
                      </TableCell>
                      <TableCell className="text-wrap p-4">
                        {action.agent.simsId
                          ? action.agent.simsId
                          : "No user ID"}
                      </TableCell>
                      <TableCell className="text-wrap p-4">
                        {formDate(action.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Profile;
