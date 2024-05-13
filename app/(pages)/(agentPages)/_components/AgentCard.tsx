import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Role } from "@prisma/client";
import {
  CalendarCheck,
  Fingerprint,
  Link as LinkIco,
  Mail,
} from "lucide-react";
import Link from "next/link";
import DeleteBtn from "../agent/_components/DeleteBtn";
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
//@ts-ignore
async function AgentCard({
  name,
  surname,
  simsId,
  createdAt,
  role,
  id,
  email,
}: Props) {
  const session = await auth();
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row">
          <div className="flex-2">
            <h1 className=" text-xl font-bold">
              {name} {surname}
            </h1>

            <p className="text-sm text-muted-foreground">
              <b>ID</b>: {id}
            </p>
          </div>
          <div className="flex flex-1 items-start justify-end ">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@dbschenker"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-muted-foreground h-[150px]">
          <div className="flex gap-2 items-center justify-start">
            {" "}
            <Fingerprint size={20} /> {simsId}{" "}
          </div>
          <div className="flex gap-2 items-center justify-start">
            {" "}
            <Mail size={20} /> {email}{" "}
          </div>
          <div className="flex gap-2 items-center justify-start">
            {" "}
            <CalendarCheck size={20} /> {createdAt}{" "}
          </div>
        </CardContent>
        <CardFooter className="flex items-center">
          <div className="flex flex-1 items-center justify-start">
            <Badge className="text-muted-foreground" variant="outline">
              {role === "USER_ADMIN"
                ? "USER ADMIN"
                : role === "GLOBAL_ADMIN"
                ? "GLOBAL ADMIN"
                : role}
            </Badge>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <TempModify
              agent={session?.user}
              email={email}
              name={name}
              role={role}
              simsId={simsId}
              surname={surname}
              id={id}
            />
            <Link href={`/agent/${id}`}>
              <Button variant={"outline"} size={"icon"}>
                <LinkIco size={20} />
              </Button>
            </Link>
            <DeleteBtn id={id} session={session!} simsId={simsId} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AgentCard;
