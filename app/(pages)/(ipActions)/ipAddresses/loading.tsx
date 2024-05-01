import { Loader2 } from "lucide-react";
export default function PageLoading({ ...props }) {
  return (
    <div className="w-[90vw] h-screen flex items-center justify-center">
      <Loader2 className="size-24 animate-spin" />
    </div>
  );
}
