import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as attendanceService from "@/features/attendance/attendance.services";
import { AttendanceDataSchema } from "@/validators/attendance";
import { validateRequestFormData } from "@/utils/validator-helper";
import { TypeofAttendanceData } from "@/validators/attendance";

export const GET = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await attendanceService.getAttendanceById(id);
    return NextResponse.json(result);
  }
);

export const PUT = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const data = await validateRequestFormData(
      req,
      AttendanceDataSchema.partial()
    );
    const result = await attendanceService.updateAttendance(
      id,
      data as Partial<TypeofAttendanceData>
    );
    return NextResponse.json(result);
  }
);

export const DELETE = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await attendanceService.deleteAttendance(id);
    return NextResponse.json(result);
  }
);
