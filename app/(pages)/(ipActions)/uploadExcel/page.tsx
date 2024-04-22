import { getUserBySimsId } from "@/actions/data/user";
import { auth } from "@/auth";
import UploadExcel from "@/components/ExcelUpload";
import React from "react";

const ExcelUpload: React.FC = async ({ ...props }) => {
  const { ...session } = await auth();
  console.log(session.user);
  return (
    <div>
      <UploadExcel />
    </div>
  );
};

export default ExcelUpload;
