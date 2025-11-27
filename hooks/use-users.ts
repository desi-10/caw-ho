import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

// Query Keys
export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (page: number) => [...USER_KEYS.lists(), page] as const,
};

/**
 * Hook to fetch paginated users list
 */
export function useUsers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: USER_KEYS.list(page),
    queryFn: () => userService.getList(page, limit),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
}

