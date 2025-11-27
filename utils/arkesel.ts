import axios from "axios";

export const sendArkeselSMS = async (
  recipients: string[],
  message: string,
  scheduledFor?: Date
) => {
  const apiKey = process.env.ARKESEL_API_KEY; // 🔥 Must be correct
  const senderId = process.env.ARKESEL_SENDER_ID; // 🔥 Must be approved

  if (!apiKey || !senderId) {
    throw new Error("Arkesel API Key or Sender ID is missing in environment");
  }

  const payload: any = {
    sender: senderId,
    message: message,
    recipients: recipients,
  };

  // Handle scheduling — Arkesel format: YYYY-MM-DD HH:mm
  if (scheduledFor) {
    const y = scheduledFor.getFullYear();
    const m = String(scheduledFor.getMonth() + 1).padStart(2, "0");
    const d = String(scheduledFor.getDate()).padStart(2, "0");
    const hh = String(scheduledFor.getHours()).padStart(2, "0");
    const mm = String(scheduledFor.getMinutes()).padStart(2, "0");

    payload.schedule = `${y}-${m}-${d} ${hh}:${mm}`;
  }

  try {
    const response = await axios.post(
      "https://sms.arkesel.com/api/v2/sms/send",
      payload,
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error(
      "Arkesel SMS Error:",
      err.response?.data || err.message
    );
    throw new Error("Failed to send SMS via Arkesel");
  }
};
