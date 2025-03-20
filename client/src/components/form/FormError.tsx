import { FC } from "react";

interface FormErrorProps {
  message: string;
}

export const FormError: FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-sm font-medium text-red-600">
      {message}
    </p>
  );
};