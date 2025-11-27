import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { smsService } from "@/services/sms.service";
import { toast } from "sonner";

// Query Keys
export const SMS_KEYS = {
  all: ["sms"] as const,
  lists: () => [...SMS_KEYS.all, "list"] as const,
  list: (page: number) => [...SMS_KEYS.lists(), page] as const,
};

/**
 * Hook to fetch paginated SMS list
 */
export function useSMS(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: SMS_KEYS.list(page),
    queryFn: () => smsService.getList(page, limit),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to create a new SMS
 */
export function useCreateSMS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: smsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SMS_KEYS.lists() });
      toast.success("SMS scheduled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to schedule SMS");
    },
  });
}

/**
 * Hook to delete an SMS
 */
export function useDeleteSMS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: smsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SMS_KEYS.lists() });
      toast.success("SMS deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete SMS");
    },
  });
}

