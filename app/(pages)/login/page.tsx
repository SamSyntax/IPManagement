import { getSession } from "@/lib/actions/auth-actions";
import React from "react";

const page = async ({ ...props }) => {
  const session = await getSession();
  console.log(session);
  return <div>page</div>;
};

export default page;
