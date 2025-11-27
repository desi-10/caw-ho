import { apiResponse } from "@/utils/api-response";
import { prisma } from "@/utils/db";
import { TypeofAttendanceData } from "@/validators/attendance";
import StatusCodes from "http-status-codes";
import { ApiError } from "@/utils/api-error";
import { AttendanceStatus } from "@prisma/client";

export const getAttendances = async (page: number = 1, limit: number = 10) => {
  const attendances = await prisma.attendance.findMany({
    orderBy: {
      date: "desc",
    },
    include: {
      member: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalAttendances = await prisma.attendance.count();
  const totalPages = Math.ceil(totalAttendances / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return apiResponse("Attendances fetched successfully", {
    attendances,
    pagination: {
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
};

export const createAttendance = async (
  attendanceData: TypeofAttendanceData
) => {
  const { firstname, lastname, phone, status, date, memberId } = attendanceData;

  const attendance = await prisma.attendance.create({
    data: {
      firstname,
      lastname,
      memberId: memberId || null,
      status: (status as AttendanceStatus) || AttendanceStatus.PRESENT,
      date: date ? new Date(date) : new Date(),
    },
  });

  return apiResponse("Attendance created successfully", attendance);
};

export const getAttendanceById = async (id: string) => {
  const attendance = await prisma.attendance.findUnique({
    where: { id },
    include: {
      member: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });

  if (!attendance) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Attendance not found");
  }

  return apiResponse("Attendance fetched successfully", attendance);
};

export const updateAttendance = async (
  id: string,
  attendanceData: Partial<TypeofAttendanceData>
) => {
  const { firstname, lastname, status, date, memberId } = attendanceData;

  const existingAttendance = await prisma.attendance.findUnique({
    where: { id },
  });

  if (!existingAttendance) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Attendance not found");
  }

  const updatedAttendance = await prisma.attendance.update({
    where: { id },
    data: {
      firstname,
      lastname,
      memberId: memberId || undefined,
      status: status as AttendanceStatus,
      date: date ? new Date(date) : undefined,
    },
  });

  return apiResponse("Attendance updated successfully", updatedAttendance);
};

export const deleteAttendance = async (id: string) => {
  const existingAttendance = await prisma.attendance.findUnique({
    where: { id },
  });

  if (!existingAttendance) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Attendance not found");
  }

  await prisma.attendance.delete({
    where: { id },
  });

  return apiResponse("Attendance deleted successfully", null);
};
