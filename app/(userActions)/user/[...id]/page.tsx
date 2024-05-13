import { getUserById } from "@/actions/ipActions";
import NotFoundPage from "@/app/not-found";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  Database,
  Fingerprint,
  Globe2,
  NetworkIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import ActionsTable from "../_datatable/ActionsTable";

interface Props {
  params: {
    id: string;
  };
}
const page = async ({ params }: Props) => {
  const user: any = await getUserById(params.id.toString());
  if (!user) {
    return <NotFoundPage />;
  }

  const session = await auth();

  console.log(user);

  if (!session) {
    redirect("auth/login");
  }

  return (
    <div className=" w-[90vw] flex flex-col justify-start h-full overflow-hidden  ">
      <div className=" border-b border-muted p-8  flex  h-[35vh]">
        <div className="flex flex-col items-start justify-start flex-1 h">
          <div className="h-full flex flex-col items-baseline justify-start gap-10">
            <div className="grid grid-cols-1 items-start justify-start gap-4 text-sm text-muted-foreground ">
              <Badge variant={"outline"} className="p-1 gap-2 min-w-28">
                <Database size={18} />
                <p className=" font-bold">{user.id}</p>
              </Badge>
              <Badge variant={"outline"} className="gap-2 p-1 min-w-28">
                <NetworkIcon size={18} />
                <p className=" font-bold">{user.address}</p>
              </Badge>
              <Badge variant={"outline"} className="p-1 gap-2 min-w-28">
                <Globe2 size={18} />
                <p className=" font-bold">{user.ipAddress.region}</p>
              </Badge>
              <Badge variant={"outline"} className="p-1 gap-2 min-w-28">
                <CheckCircleIcon size={18} />
                <p className=" font-bold">{user.ipAddress.type}</p>
              </Badge>
              <Badge variant={"outline"} className="p-1 gap-2 min-w-28">
                <Fingerprint size={18} />
                <p className=" font-bold">{user.simsId}</p>
              </Badge>
            </div>
          </div>
        </div>
      </div>
      <ActionsTable id={params.id.toString()} />
    </div>
  );
};

export default page;
