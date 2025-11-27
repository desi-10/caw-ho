"use client";

import {
  IconTrendingUp,
  IconUsers,
  IconUserPlus,
  IconArrowUpRight,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function SectionCards() {
  const {
    data: stats,
    isLoading: loading,
    isError: error,
  } = useDashboardStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-32 bg-muted rounded mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-destructive/50">
            <CardHeader>
              <CardDescription className="text-destructive text-xs">
                Failed to load data
              </CardDescription>
              <CardTitle className="text-muted-foreground">--</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  // Format numbers with + prefix if positive
  const formatChange = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return numValue > 0 ? `+${numValue}` : numValue.toString();
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <CardHeader className="relative z-10 pb-2">
          <CardDescription className="text-blue-100 text-xs font-medium uppercase tracking-wide">
            Total Revenue
          </CardDescription>
          <CardTitle className="text-4xl font-bold mt-2">
            GHS{" "}
            {parseFloat(stats.revenueThisMonth).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </CardTitle>
        </CardHeader>
        <CardFooter className="relative z-10 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <IconTrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  GHS{" "}
                  {parseFloat(stats.revenueThisMonth).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-blue-100">vs last month</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Total Members Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 to-purple-700 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <CardHeader className="relative z-10 pb-2">
          <CardDescription className="text-purple-100 text-xs font-medium uppercase tracking-wide">
            Total Members
          </CardDescription>
          <CardTitle className="text-4xl font-bold mt-2">
            {stats.totalMembers.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="relative z-10 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <IconUsers className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {formatChange(stats.membersChange)}
                </p>
                <p className="text-xs text-purple-100">new this month</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* New Timers Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-600 to-amber-800 text-gray-900 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16" />
        <CardHeader className="relative z-10 pb-2">
          <CardDescription className="text-amber-900 text-xs font-medium uppercase tracking-wide">
            New Timers
          </CardDescription>
          <CardTitle className="text-4xl font-bold mt-2">
            {stats.newTimers.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="relative z-10 pt-4 border-t border-amber-600/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/30 rounded-lg backdrop-blur-sm">
                <IconUserPlus className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {formatChange(stats.newTimersChange)}
                </p>
                <p className="text-xs text-white">this month</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Growth Rate Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-bl from-green-500 to-green-600 text-gray-900">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16" />
        <CardHeader className="relative z-10 pb-2">
          <CardDescription className="text-white text-xs font-medium uppercase tracking-wide">
            Growth Rate
          </CardDescription>
          <CardTitle className="text-4xl font-bold mt-2 text-white">
            {stats.growthRate}
          </CardTitle>
        </CardHeader>
        <CardFooter className="relative z-10 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/30 rounded-lg backdrop-blur-sm">
                <IconArrowUpRight className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Monthly</p>
                <p className="text-xs text-white">member growth</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
