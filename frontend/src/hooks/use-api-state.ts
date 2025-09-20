import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { useToast } from "./use-toast";

interface UseApiStateOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useApiState(options: UseApiStateOptions = {}) {
  const {
    successMessage = "Operation successful",
    errorMessage = "An error occurred",
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRequest = useCallback(
    async <T>(
      request: () => Promise<T>,
      customSuccessMessage?: string,
      customErrorMessage?: string
    ): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await request();

        if (showSuccessToast) {
          toast({
            title: "Success",
            description: customSuccessMessage || successMessage,
          });
        }

        return result;
      } catch (err) {
        const errorMsg =
          customErrorMessage ||
          (err instanceof AxiosError ? err.response?.data?.message : null) ||
          errorMessage;

        setError(errorMsg);

        if (showErrorToast) {
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg,
          });
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [successMessage, errorMessage, showSuccessToast, showErrorToast, toast]
  );

  return {
    isLoading,
    error,
    handleRequest,
    setError,
  };
}
