"use client";

import { columns } from "@/app/(pages)/(ipActions)/uploadExcel/column";
import { DataTable } from "@/app/(pages)/(ipActions)/uploadExcel/data-table";
import excelExample from "@/public/images/excelExample.png";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";
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
          description: "Some of these addresses are already in the database 😉",
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
    <div className="w-full p-24 flex flex-col gap-4 justify-center items-center ">
      <div className="flex gap-2 items-center justify-start w-full  ">
        <Input
          className="max-w-[250px] cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all ease-in-out duration-300"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          disabled={isSubmitting}
        />
        <HoverCard>
          <HoverCardTrigger className="flex gap-4 items-center justify-center">
            <Button
              disabled={isSubmitting || data.length === 0}
              type="submit"
              variant="outline"
              onClick={handleSubmit}>
              {!isSubmitting ? "Upload" : "Uploading..."}
            </Button>

            <span className=" hover:border-b-2  p-1 border-primary-foreground cursor-pointer ">
              @hover for tip
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col gap-2">
            <p>
              Excel file should contain headers titled: <b>address</b>,{" "}
              <b>type</b> and <b>region</b>
            </p>
            <Image
              src={excelExample}
              height={500}
              alt="excel file example"
              className="rounded-md"
            />
          </HoverCardContent>
        </HoverCard>
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
