import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center  justify-center text-center w-full gap-2 bg-destructive text-destructive-foreground p-2 rounded-md">
      <ExclamationTriangleIcon />
      <p>{message}</p>{" "}
    </div>
  );
};
