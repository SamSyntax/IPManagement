import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Role } from "@prisma/client";
import { CalendarCheck, Mail } from "lucide-react";

interface Props {
  name: string;
  surname: string;
  simsId: string;
  createdAt: string;
  role: Role;
  id?: string;
  email: string;
}
function UserCard({
  name,
  surname,
  simsId,
  createdAt,
  role,
  id,
  email,
}: Props) {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row">
          <div className="flex-2">
            <h1 className=" text-xl font-bold">
              {name} {surname}
            </h1>
            <p className="text-sm text-muted-foreground">
              <b>SIMSID</b>: {simsId}
            </p>
            <p className="text-sm text-muted-foreground">
              <b>ID</b>: {id}
            </p>
          </div>
          <div className="flex flex-1 items-start justify-end ">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@dbschenker"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-muted-foreground">
          <div className="flex gap-2 items-center justify-start">
            {" "}
            <Mail size={20} /> {email}{" "}
          </div>
          <div className="flex gap-2 items-center justify-start">
            {" "}
            <CalendarCheck size={20} /> {createdAt}{" "}
          </div>
        </CardContent>
        <CardFooter>
          <Badge className="text-muted-foreground" variant="outline">
            {role}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}

export default UserCard;
