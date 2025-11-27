import axios from "axios";

export interface Finance {
  id: string;
  amount: string;
  type: string;
  category: string;
  description?: string;
  date: string;
  member?: {
    firstName: string;
    lastName: string;
  } | null;
  reference?: string;
  status: string;
  paymentType?: string;
  currency: string;
  reconciled: boolean | string;
  receiptUrl?: string;
  fund?: string;
  notes?: string;
  firstname?: string;
  lastname?: string;
  approvedBy?: {
    name: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface FinanceListResponse {
  success: boolean;
  data: {
    finances: Finance[];
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

export interface CreateFinanceData {
  amount: string;
  type: string;
  category: string;
  date: string;
  member?: string;
  reference?: string;
  status: string;
  paymentType?: string;
  currency: string;
  fund?: string;
}

export const financeService = {
  /**
   * Fetch paginated list of finances
   */
  getList: async (page: number = 1, limit: number = 10) => {
    const { data } = await axios.get<FinanceListResponse>(
      `/api/finance?page=${page}&limit=${limit}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch finances");
    }

    return data.data;
  },

  /**
   * Create a new finance record
   */
  create: async (financeData: CreateFinanceData) => {
    const { data } = await axios.post("/api/finance", financeData);

    if (!data.success) {
      throw new Error(data.message || "Failed to create finance record");
    }

    return data.data;
  },

  /**
   * Delete a finance record
   */
  delete: async (id: string) => {
    const { data } = await axios.delete<{ success: boolean; message: string }>(
      `/api/finance/${id}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to delete finance record");
    }

    return data;
  },
};
