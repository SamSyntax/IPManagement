import { Download } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const ExportData = () => {
  return (
    <Button variant={"outline"}>
      <Link
        href="/api/exportData"
        className="flex gap-1 items-center justify-center">
        <Download size={15} />
        Export
      </Link>
    </Button>
  );
};

export default ExportData;
