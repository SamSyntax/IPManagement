"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";
import { DataTable } from "@/app/(pages)/(ipActions)/uploadExcel/data-table";
import { columns } from "@/app/(pages)/(ipActions)/uploadExcel/column";
import { useToast } from "./ui/use-toast";

export function UploadExcel() {
  const [data, setData] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileUpload = (e: any) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target!.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/upload-excel", data);
      if (response.status === 201) {
        toast({
          title: "Excel uploaded successfully!",
          description:
            "Some of the addresses have already been in the database",
        });
      } else {
        toast({
          title: "Excel uploaded successfully!",
        });
      }

      return response;
    } catch (error: any) {
      console.error("Error adding user:", error);
      if (data.length === 0) {
        toast({
          title: "Error uploading Excel!",
          description: `Please select a file`,
          variant: "destructive",
        });
      } else if (
        error.response &&
        error.response.data &&
        "error" in error.response.data
      )
        toast({
          title: "Error uploading Excel!",
          description: `${error.response.data.error}`,
          variant: "destructive",
        });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen p-24 flex flex-col gap-4 justify-center items-center ">
      <div className="flex gap-2 items-center justify-start min-w-[1200px]  ">
        <Input
          className="max-w-[250px]"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="outline"
          onClick={handleSubmit}
        >
          {!isSubmitting ? "Upload" : "Uploading..."}
        </Button>
      </div>
      <div>
        <div className="w-full flex items-center justify-center">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default UploadExcel;
