import { getActionByAgentId, getUserById } from "@/actions/data/user";
import NotFoundPage from "@/app/not-found";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Fingerprint, Mail, Workflow } from "lucide-react";
import { redirect } from "next/navigation";
import TempModify from "../../_components/TempMofify";
import DeleteBtn from "../_components/DeleteBtn";
import ActionsTable from "../_datatable/ActionsTable";

interface Props {
  params: {
    id: string;
  };
}
const page = async ({ params }: Props) => {
  const user = await getUserById(params.id.toString());

  if (!user) {
    return <NotFoundPage />;
  }

  const session = await auth();

  if (!session) {
    redirect("auth/login");
  }

  const actions = await getActionByAgentId(params.id.toString());

  return (
    <div className=" w-[90vw] flex flex-col justify-start h-full overflow-hidden  ">
      <div className=" border-b border-muted p-8  flex  h-[35vh]">
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
                  {user!.name} {user!.surname}
                </h1>
                <div className="flex gap-2">
                  <Badge
                    className="flex items-center justify-center p-2 rounded-sm max-w-[150px]"
                    variant="outline">
                    {user!.role}
                  </Badge>
                  <TempModify
                    id={params.id.toString()}
                    email={user!.email}
                    name={user!.name}
                    role={user!.role}
                    simsId={user!.simsId}
                    surname={user!.surname}
                    agent={session?.user}
                  />
                  <DeleteBtn
                    id={params.id.toString()}
                    session={session}
                    simsId={user.simsId}
                  />
                </div>
                <h1 className="text-muted-foreground">ID: {user!.id}</h1>
              </div>
            </div>
            <div className="flex flex-col items-start justify-center gap-2 text-sm text-muted-foreground ">
              <div className="flex gap-2 items-center justify-center">
                <Mail size={18} />
                <p className=" font-bold">{user!.email}</p>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <Fingerprint size={18} />
                <p className=" font-bold">{user!.simsId}</p>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <CalendarCheck size={18} />
                <p className="  font-bold">{user!.createdAt.toUTCString()}</p>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <Workflow size={18} />
                <p className="  font-bold">{actions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ActionsTable id={params.id} />
    </div>
  );
};

export default page;
