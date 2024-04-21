import { Loader2 } from "lucide-react";
import React from "react";
export default function PageLoading({ ...props }) {
  return (
    <div className="w-screen h-[90vh] flex items-center justify-center">
      <Loader2 className="size-24 animate-spin" />
    </div>
  );
}
