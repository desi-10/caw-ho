import { useQuery } from "@tanstack/react-query";
import { dashboardService, DashboardStats } from "@/services/dashboard.service";

export const DASHBOARD_STATS_KEY = ["dashboard", "stats"];

export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: DASHBOARD_STATS_KEY,
    queryFn: dashboardService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes - dashboard data doesn't change frequently
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
}

