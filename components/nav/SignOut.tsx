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
        }}
      >
        <Button size="icon" variant="outline" type="submit">
          <LogOut />
        </Button>
      </form>
    </div>
  );
};

export default SignOut;
