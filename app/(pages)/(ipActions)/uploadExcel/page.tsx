import UploadExcel from "@/components/ExcelUpload";
import React from "react";
import { auth } from "@/auth";

const page: React.FC = async ({ ...props }) => {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <UploadExcel />
    </div>
  );
};

export default page;
