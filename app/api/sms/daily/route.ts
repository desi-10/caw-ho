import { prisma } from "@/utils/db";
import { sendArkeselSMS } from "@/utils/arkesel";
import { SMSStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const todayWeekday = now.getDay(); // 0 = Sunday ... 6 = Saturday
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

  // Get all active schedules for today
  const dueSMS = await prisma.scheduledSMS.findMany({
    where: {
      status: SMSStatus.PENDING,
      dayOfWeek: todayWeekday,
    },
  });

  if (!dueSMS.length) {
    return NextResponse.json({ processed: 0 });
  }

  const toSend: typeof dueSMS = [];

  for (const sms of dueSMS) {
    const scheduledTime = new Date(sms.scheduledFor);
    const scheduledMinutes =
      scheduledTime.getHours() * 60 + scheduledTime.getMinutes();

    if (sms.isRecurring) {
      // 🔁 For recurring messages, fire when the current time >= scheduled time
      if (currentTime >= scheduledMinutes) {
        toSend.push(sms);
      }
    } else {
      // 🔹 For one-time messages, fire only if scheduledFor <= now
      if (sms.scheduledFor <= now) {
        toSend.push(sms);
      }
    }
  }

  if (!toSend.length) {
    return NextResponse.json({ processed: 0 });
  }

  // ✅ Batch all recipients by message
  const grouped = toSend.reduce((acc, sms) => {
    const recipients = JSON.parse(sms.recipients);
    recipients.forEach((recipient: any) => {
      const phone = typeof recipient === "string" ? recipient : recipient.phone;
      const name = typeof recipient === "string" ? "" : recipient.name || "";
      const title = typeof recipient === "string" ? "" : recipient.title || "";
      let msgToSend = sms.message.replace(/{name}/g, name || "Member");
      if (title) {
        msgToSend = msgToSend.replace(/{title}/g, title);
      } else {
        msgToSend = msgToSend.replace(/{title}\s?/g, ""); // Remove title placeholder if empty
      }
      acc[msgToSend] = acc[msgToSend] || [];
      acc[msgToSend].push(phone);
    });
    return acc;
  }, {} as Record<string, string[]>);

  try {
    for (const [message, recipients] of Object.entries(grouped)) {
      await sendArkeselSMS(recipients, message);
    }

    // Update statuses
    const ids = toSend.map((s) => s.id);
    await prisma.scheduledSMS.updateMany({
      where: { id: { in: ids } },
      data: { status: SMSStatus.SENT },
    });
  } catch (err) {
    console.error("SMS send error", err);
    const ids = toSend.map((s) => s.id);
    await prisma.scheduledSMS.updateMany({
      where: { id: { in: ids } },
      data: { status: SMSStatus.FAILED },
    });
  }

  return NextResponse.json({ processed: toSend.length });
}
