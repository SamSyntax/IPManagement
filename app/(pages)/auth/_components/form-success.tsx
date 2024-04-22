import { CheckCircle2 } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-center text-center w-full gap-2 text-white p-2 bg-green-600 rounded-md">
      <CheckCircle2 />
      <p>{message}</p>{" "}
    </div>
  );
};
