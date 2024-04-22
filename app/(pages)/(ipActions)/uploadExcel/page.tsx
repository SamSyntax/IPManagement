import UploadExcel from "@/components/ExcelUpload";
import React from "react";

const page: React.FC = async ({ ...props }) => {
  return (
    <div>
      <UploadExcel />
    </div>
  );
};

export default page;
