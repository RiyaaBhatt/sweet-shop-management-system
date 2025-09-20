
import { HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  text?: string;
}

export function Loading({
  size = 24,
  text = "Loading...",
  className = "",
  ...props
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 p-4 ${className}`}
      {...props}
    >
      <Loader2 className="animate-spin" size={size} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorMessage({
  title = "Error",
  message,
  className = "",
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={`my-4 ${className}`}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
