import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
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

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const userService = {
  /**
   * Fetch paginated list of users
   */
  getList: async (page: number = 1, limit: number = 10) => {
    const { data } = await axios.get<UserListResponse>(
      `/api/user?page=${page}&limit=${limit}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data.data;
  },

  /**
   * Create a new user
   */
  create: async (userData: CreateUserData) => {
    const { data } = await axios.post("/api/user", userData);

    if (!data.success) {
      throw new Error(data.message || "Failed to create user");
    }

    return data.data;
  },

  /**
   * Delete a user
   */
  delete: async (id: string) => {
    const { data } = await axios.delete<{ success: boolean; message: string }>(
      `/api/user/${id}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to delete user");
    }

    return data;
  },
};

