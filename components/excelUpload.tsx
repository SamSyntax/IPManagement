"use client";

import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const FileUploadForm = async () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/api/ep", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (err) {
      alert(err);
    }
  };
  return (
    <div>
      <form>
        <Input type="file" onChange={handleFileChange} />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};
