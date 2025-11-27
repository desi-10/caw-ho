import axios from "axios";

export interface DashboardStats {
  totalRevenue: string;
  revenueThisMonth: string;
  revenueLastMonth: string;
  revenueChange: string;
  totalMembers: number;
  membersChange: string;
  newTimers: number;
  newTimersChange: string;
  growthRate: string;
  chartData?: Array<{
    date: string;
    members: number;
    newTimers: number;
  }>;
}

interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message?: string;
}

export const dashboardService = {
  /**
   * Fetch dashboard statistics
   * @returns Dashboard statistics including revenue, members, new timers, and growth rate
   */
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await axios.get<DashboardStatsResponse>(
      "/api/dashboard/stats"
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch dashboard stats");
    }

    return data.data;
  },
};
