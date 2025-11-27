import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { memberService } from "@/services/member.service";
import { toast } from "sonner";

// Query Keys
export const MEMBER_KEYS = {
  all: ["members"] as const,
  lists: () => [...MEMBER_KEYS.all, "list"] as const,
  list: (page: number) => [...MEMBER_KEYS.lists(), page] as const,
  details: () => [...MEMBER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...MEMBER_KEYS.details(), id] as const,
};

/**
 * Hook to fetch paginated members list
 */
export function useMembers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: MEMBER_KEYS.list(page),
    queryFn: () => memberService.getList(page, limit),
    placeholderData: keepPreviousData, // Keep old data while fetching new page
  });
}

/**
 * Hook to fetch single member by ID
 */
export function useMember(id: string) {
  return useQuery({
    queryKey: MEMBER_KEYS.detail(id),
    queryFn: () => memberService.getById(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

/**
 * Hook to create a new member
 */
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberService.create,
    onSuccess: (data) => {
      // Invalidate members list to refetch
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.lists() });
      toast.success("Member created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create member");
    },
  });
}

/**
 * Hook to update an existing member
 */
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberService.update,
    onSuccess: (data) => {
      // Invalidate specific member and lists
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success("Member updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update member");
    },
  });
}

/**
 * Hook to delete a member
 */
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberService.delete,
    onSuccess: (response) => {
      // Invalidate lists and dashboard stats
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success(response.message || "Member deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete member");
    },
  });
}
