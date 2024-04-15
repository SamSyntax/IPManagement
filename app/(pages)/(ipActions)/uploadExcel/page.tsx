import UploadExcel from "@/components/ExcelUpload";
import React from "react";

const page: React.FC = ({ ...props }) => {
  return (
    <div>
      <UploadExcel />
    </div>
  );
};

export default page;
