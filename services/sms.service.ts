import axios from "axios";

export interface SMS {
  id: string;
  message: string;
  recipients: string[];
  scheduledFor?: string;
  status: string;
  sentAt?: string | null;
  sentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SMSListResponse {
  success: boolean;
  data: {
    sms: SMS[];
    pagination: {
      page: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      total: number;
    };
  };
  message?: string;
}

export interface CreateSMSData {
  message: string;
  recipients: string[];
  scheduledFor?: Date | null;
  isRecurring?: boolean;
  dayOfWeek?: number;
}

export const smsService = {
  /**
   * Fetch paginated list of SMS
   */
  getList: async (page: number = 1, limit: number = 10) => {
    const { data } = await axios.get<SMSListResponse>(
      `/api/sms?page=${page}&limit=${limit}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch SMS");
    }

    return data.data;
  },

  /**
   * Create a new SMS
   */
  create: async (smsData: CreateSMSData) => {
    const { data } = await axios.post("/api/sms", smsData);

    if (!data.success) {
      throw new Error(data.message || "Failed to create SMS");
    }

    return data.data;
  },

  /**
   * Delete an SMS
   */
  delete: async (id: string) => {
    const { data } = await axios.delete<{ success: boolean; message: string }>(
      `/api/sms/${id}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to delete SMS");
    }

    return data;
  },
};

