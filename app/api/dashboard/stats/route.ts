import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  // Get total members
  const totalMembers = await prisma.member.count();

  // Get members added this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const membersThisMonth = await prisma.member.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  // Get total revenue
  const financeRecords = await prisma.finance.findMany({
    where: {
      status: "COMPLETED",
    },
  });

  const totalRevenue = financeRecords.reduce((sum, record) => {
    // Convert to a common currency if needed, for now just sum GHS
    if (record.currency === "GHS") {
      return sum + Number(record.amount);
    }
    // You might want to add currency conversion here
    return sum;
  }, 0);

  // Get revenue this month
  const revenueThisMonth = financeRecords
    .filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startOfMonth && record.currency === "GHS";
    })
    .reduce((sum, record) => sum + Number(record.amount), 0);

  // Get revenue last month for comparison
  const lastMonthStart = new Date(startOfMonth);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  const revenueLastMonth = financeRecords
    .filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate >= lastMonthStart &&
        recordDate < startOfMonth &&
        record.currency === "GHS"
      );
    })
    .reduce((sum, record) => sum + Number(record.amount), 0);

  // Get new timers (first-time attendees) this month
  const newTimers = await prisma.attendance.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
      memberId: null, // First timers don't have memberId
    },
  });

  // Get attendance data for chart (last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      date: {
        gte: ninetyDaysAgo,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // Group attendance by date
  const attendanceByDate = attendanceRecords.reduce(
    (acc: Record<string, { members: number; newTimers: number }>, record) => {
      const dateKey = new Date(record.date).toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { members: 0, newTimers: 0 };
      }
      if (record.memberId) {
        acc[dateKey].members += 1;
      } else {
        acc[dateKey].newTimers += 1;
      }
      return acc;
    },
    {}
  );

  // Convert to array format for chart
  const chartData = Object.entries(attendanceByDate).map(([date, data]) => ({
    date,
    members: data.members,
    newTimers: data.newTimers,
  }));

  // Calculate growth rate (member growth percentage)
  const membersLastMonthStart = new Date(startOfMonth);
  membersLastMonthStart.setMonth(membersLastMonthStart.getMonth() - 1);

  const membersLastMonth = await prisma.member.count({
    where: {
      createdAt: {
        gte: membersLastMonthStart,
        lt: startOfMonth,
      },
    },
  });

  const growthRate =
    membersLastMonth > 0
      ? ((membersThisMonth / membersLastMonth) * 100).toFixed(1)
      : "0.0";

  // Calculate revenue change percentage
  let revenueChange = "0%";
  if (revenueLastMonth > 0) {
    const changePercent =
      ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;
    revenueChange =
      changePercent >= 0
        ? `+${changePercent.toFixed(1)}%`
        : `${changePercent.toFixed(1)}%`;
  } else if (revenueThisMonth > 0) {
    revenueChange = "+100%"; // If no revenue last month but has this month
  }

  return NextResponse.json({
    success: true,
    data: {
      totalRevenue: totalRevenue.toFixed(2),
      revenueChange,
      totalMembers,
      membersChange: membersThisMonth.toString(),
      newTimers,
      newTimersChange: newTimers.toString(),
      growthRate: `${growthRate}%`,
      chartData,

      revenueThisMonth: revenueThisMonth.toFixed(2),
      revenueLastMonth: revenueLastMonth.toFixed(2),
    },
  });
});
