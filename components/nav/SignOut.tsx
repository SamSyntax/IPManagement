"use server";
import { signOut } from "@/auth";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

const SignOut = async () => {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}>
        <Button
          size="icon"
          className=" flex items-center justify-center p-1 w-8 h-8"
          variant="outline"
          type="submit">
          <LogOut />
        </Button>
      </form>
    </div>
  );
};

export default SignOut;
