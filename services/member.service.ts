import axios from "axios";

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  image?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface MemberListResponse {
  success: boolean;
  data: {
    members: Member[];
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

export interface MemberDetailResponse {
  success: boolean;
  data: Member;
  message?: string;
}

export interface CreateMemberData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  image?: File;
  userId?: string;
}

export interface UpdateMemberData extends Partial<CreateMemberData> {
  id: string;
}

export const memberService = {
  /**
   * Fetch paginated list of members
   */
  getList: async (page: number = 1, limit: number = 10) => {
    const { data } = await axios.get<MemberListResponse>(
      `/api/member?page=${page}&limit=${limit}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch members");
    }

    return data.data;
  },

  /**
   * Fetch single member by ID
   */
  getById: async (id: string) => {
    const { data } = await axios.get<MemberDetailResponse>(`/api/member/${id}`);

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch member");
    }

    return data.data;
  },

  /**
   * Create a new member
   */
  create: async (memberData: CreateMemberData) => {
    const formData = new FormData();
    
    Object.entries(memberData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const { data } = await axios.post<MemberDetailResponse>(
      "/api/member",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to create member");
    }

    return data.data;
  },

  /**
   * Update an existing member
   */
  update: async (memberData: UpdateMemberData) => {
    const { id, ...updateData } = memberData;
    const formData = new FormData();
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const { data } = await axios.put<MemberDetailResponse>(
      `/api/member/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to update member");
    }

    return data.data;
  },

  /**
   * Delete a member
   */
  delete: async (id: string) => {
    const { data } = await axios.delete<{ success: boolean; message: string }>(
      `/api/member/${id}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to delete member");
    }

    return data;
  },
};

