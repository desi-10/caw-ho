import { apiResponse } from "@/utils/api-response";
import { prisma } from "@/utils/db";
import { TypeofSMSData } from "@/validators/sms";
import StatusCodes from "http-status-codes";
import { ApiError } from "@/utils/api-error";
import { SMSStatus } from "@prisma/client";
import { sendArkeselSMS } from "@/utils/arkesel";

export const sendSMS = async (smsData: TypeofSMSData) => {
  const { message, recipients, scheduledFor, dayOfWeek, isRecurring } = smsData;

  const recipientsString = JSON.stringify(recipients);

  // 1️⃣ Scheduled or recurring message
  if (scheduledFor && isRecurring && dayOfWeek) {
    const scheduleDate = scheduledFor ? new Date(scheduledFor) : new Date();
    const weekday =
      dayOfWeek !== undefined
        ? parseInt(dayOfWeek as any)
        : scheduleDate.getDay();

    const scheduledSMS = await prisma.scheduledSMS.create({
      data: {
        message,
        recipients: recipientsString,
        scheduledFor: scheduleDate,
        dayOfWeek: weekday,
        isRecurring: !!isRecurring,
        status: SMSStatus.PENDING,
      },
    });

    return apiResponse(
      isRecurring
        ? "Recurring SMS scheduled successfully"
        : "SMS scheduled successfully",
      scheduledSMS
    );
  }

  // 2️⃣ Immediate send
  await sendArkeselSMS(recipients, message, scheduledFor || new Date());

  return apiResponse("SMS sent successfully", null);
};

export const getScheduledSMS = async (page: number = 1, limit: number = 10) => {
  const scheduledSMS = await prisma.scheduledSMS.findMany({
    orderBy: {
      scheduledFor: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalSMS = await prisma.scheduledSMS.count();
  const totalPages = Math.ceil(totalSMS / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const formatted = scheduledSMS.map((sms) => ({
    ...sms,
    recipients: JSON.parse(sms.recipients),
  }));

  return apiResponse("Scheduled SMS fetched successfully", {
    sms: formatted,
    pagination: {
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
};

export const getScheduledSMSById = async (id: string) => {
  const sms = await prisma.scheduledSMS.findUnique({
    where: { id },
  });

  if (!sms) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Scheduled SMS not found");
  }

  return apiResponse("Scheduled SMS fetched successfully", {
    ...sms,
    recipients: JSON.parse(sms.recipients),
  });
};

export const updateScheduledSMS = async (
  id: string,
  smsData: Partial<TypeofSMSData>
) => {
  const { message, recipients, scheduledFor } = smsData;

  const existingSMS = await prisma.scheduledSMS.findUnique({
    where: { id },
  });

  if (!existingSMS) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Scheduled SMS not found");
  }

  if (existingSMS.status !== SMSStatus.PENDING) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Can only update pending SMS");
  }

  const updatedSMS = await prisma.scheduledSMS.update({
    where: { id },
    data: {
      message: message || undefined,
      recipients: recipients ? JSON.stringify(recipients) : undefined,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
    },
  });

  return apiResponse("Scheduled SMS updated successfully", {
    ...updatedSMS,
    recipients: JSON.parse(updatedSMS.recipients),
  });
};

export const deleteScheduledSMS = async (id: string) => {
  const existingSMS = await prisma.scheduledSMS.findUnique({
    where: { id },
  });

  if (!existingSMS) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Scheduled SMS not found");
  }

  if (existingSMS.status !== SMSStatus.PENDING) {
    await prisma.scheduledSMS.update({
      where: { id },
      data: { status: SMSStatus.CANCELLED },
    });
  } else {
    await prisma.scheduledSMS.delete({
      where: { id },
    });
  }

  return apiResponse("Scheduled SMS deleted successfully", null);
};
