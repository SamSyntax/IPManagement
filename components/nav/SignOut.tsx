"use server";
import { auth, signOut } from "@/auth";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

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
