import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Role } from "@prisma/client";
import { CalendarCheck, Fingerprint, Link, Mail } from "lucide-react";

interface Props {
  name: string;
  surname: string;
  simsId: string;
  createdAt: string;
  role: Role;
  id?: string;
  email: string;
}
//@ts-ignore
function UserCard({ name, surname, simsId, createdAt, role, id, email }) {
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
              {role}
            </Badge>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <Link
              className="hover:text-primary transition-colors ease-in-out duration-300"
              size={20}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default UserCard;
