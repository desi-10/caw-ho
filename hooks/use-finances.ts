import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { financeService } from "@/services/finance.service";
import { toast } from "sonner";

// Query Keys
export const FINANCE_KEYS = {
  all: ["finances"] as const,
  lists: () => [...FINANCE_KEYS.all, "list"] as const,
  list: (page: number) => [...FINANCE_KEYS.lists(), page] as const,
};

/**
 * Hook to fetch paginated finances list
 */
export function useFinances(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: FINANCE_KEYS.list(page),
    queryFn: () => financeService.getList(page, limit),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to create a new finance record
 */
export function useCreateFinance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.lists() });
      toast.success("Finance record created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create finance record");
    },
  });
}

/**
 * Hook to delete a finance record
 */
export function useDeleteFinance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.lists() });
      toast.success("Finance record deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete finance record");
    },
  });
}
