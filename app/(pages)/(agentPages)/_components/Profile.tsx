import { getActionByAgentId } from "@/actions/data/user";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Role } from "@prisma/client";
import { CalendarCheck, Fingerprint, Mail, Workflow } from "lucide-react";
import { columns } from "../agent/_datatable/column";
import { DataTable } from "../agent/_datatable/data-table";
import TempModify from "./TempMofify";

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
  const actions: any[] = await getActionByAgentId(id);
  const session = await auth();
  let agent = session?.user;

  return (
    <div className=" w-[90vw] border border-muted flex flex-col justify-start h-full overflow-hidden  ">
      <div className=" border-b border-muted p-8  flex  h-[50vh]">
        <div className="flex flex-col items-start justify-start flex-1 h">
          <div className="h-full flex flex-col items-baseline justify-start gap-10">
            <div className="flex gap-4 items-center ">
              <div className="flex ">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@dbschenker"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-2 ">
                <h1 className="text-2xl font-bold">
                  {name} {surname}
                </h1>
                <div className="flex gap-2">
                  <Badge
                    className="flex items-center justify-center p-2 rounded-sm max-w-[150px]"
                    variant={"outline"}>
                    {role}
                  </Badge>
                  <TempModify
                    id={id}
                    email={email}
                    name={name}
                    role={role}
                    simsId={simsId}
                    surname={surname}
                    agent={agent}
                  />
                </div>
                <h1 className="text-muted-foreground">ID: {id}</h1>
              </div>
            </div>
            <div className="flex flex-col items-start justify-center gap-2 text-sm text-muted-foreground ">
              <div className="flex gap-2 items-center justify-center">
                <Mail size={18} />
                <p className=" font-bold">{email}</p>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <Fingerprint size={18} />
                <p className=" font-bold">{simsId}</p>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <CalendarCheck size={18} />
                <p className="  font-bold">{createdAt}</p>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <Workflow size={18} />
                <p className="  font-bold">{actions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Parent */}
        <div className=" flex items flex-1 items-start justify-start"></div>
      </div>
      {/* <div className="w-[90vw] h-[49.5vh]">
        <ScrollArea className="h-full w-[90vw]">
          {actions.length < 1 ? (
            <div className="w-[90vw] h-[50vh] flex items-center justify-center text-muted-foreground">
              <h1 className="text-xl font-medium">No actions found!</h1>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center justify-start gap-2">
                      <FolderOutput size={18} />
                      <p>Action Type</p>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center justify-start gap-2">
                      <NetworkIcon size={18} />
                      <p>Address</p>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center justify-start gap-2">
                      <Fingerprint size={18} />
                      <p>SIMSID</p>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center justify-start gap-2">
                      <Calendar size={18} />
                      <p>Date</p>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-muted-foreground">
                {actions.map((action) => {
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
                        {action.user?.simsId
                          ? action.user?.simsId
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
      </div> */}
      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export default Profile;
