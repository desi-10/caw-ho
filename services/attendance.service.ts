import axios from "axios";

export interface Attendance {
  id: string;
  date: string;
  status: string;
  memberId?: string;
  member?: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  firstname?: string;
  lastname?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface AttendanceListResponse {
  success: boolean;
  data: {
    attendances: Attendance[];
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

export interface CreateAttendanceData {
  date: string;
  status: string;
  memberId?: string;
  firstname?: string;
  lastname?: string;
}

export const attendanceService = {
  /**
   * Fetch paginated list of attendances
   */
  getList: async (page: number = 1, limit: number = 10) => {
    const { data } = await axios.get<AttendanceListResponse>(
      `/api/attendance?page=${page}&limit=${limit}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch attendances");
    }

    return data.data;
  },

  /**
   * Create a new attendance record
   */
  create: async (attendanceData: CreateAttendanceData) => {
    const formData = new FormData();

    Object.entries(attendanceData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const { data } = await axios.post("/api/attendance", formData);

    if (!data.success) {
      throw new Error(data.message || "Failed to create attendance record");
    }

    return data.data;
  },

  /**
   * Delete an attendance record
   */
  delete: async (id: string) => {
    const { data } = await axios.delete<{ success: boolean; message: string }>(
      `/api/attendance/${id}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to delete attendance record");
    }

    return data;
  },
};
