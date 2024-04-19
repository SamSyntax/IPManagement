"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface Props {
  description: string;
  content: string;
}
const MessageCopy = ({ description, content }: Props) => {
  const { toast } = useToast();
  const [copy, setCopy] = useState<boolean>(false);
  const handleCopy = () => {
    setCopy(false);
    try {
      navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "The message has been copied to the clipboard",
      });
      setCopy(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Card>
        <div className="flex gap-2">
          <CardHeader className="flex-2">
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <div className="flex items-center justify-end  w-full flex-1 p-2">
            <Button size="icon" variant="ghost" onClick={handleCopy}>
              {copy ? (
                <ClipboardCheckIcon
                  className={
                    !copy
                      ? "text-zinc-600 transition-colors ease-in-out duration-500"
                      : "text-green-500 transition-colors ease-in-out duration-500"
                  }
                />
              ) : (
                <ClipboardIcon
                  className={
                    !copy
                      ? "text-zinc-600 transition-colors ease-in-out duration-500"
                      : "text-green-500 transition-colors ease-in-out duration-500"
                  }
                />
              )}
            </Button>
          </div>
        </div>
        <CardContent>
          <p>{content}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCopy;
