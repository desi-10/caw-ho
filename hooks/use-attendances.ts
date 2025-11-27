import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance.service";
import { toast } from "sonner";

// Query Keys
export const ATTENDANCE_KEYS = {
  all: ["attendances"] as const,
  lists: () => [...ATTENDANCE_KEYS.all, "list"] as const,
  list: (page: number) => [...ATTENDANCE_KEYS.lists(), page] as const,
};

/**
 * Hook to fetch paginated attendances list
 */
export function useAttendances(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.list(page),
    queryFn: () => attendanceService.getList(page, limit),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to create a new attendance record
 */
export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.lists() });
      toast.success("Attendance record created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create attendance record");
    },
  });
}

/**
 * Hook to delete an attendance record
 */
export function useDeleteAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.lists() });
      toast.success("Attendance record deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete attendance record");
    },
  });
}

