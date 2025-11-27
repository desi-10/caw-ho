import { apiResponse } from "@/utils/api-response";
import { prisma } from "@/utils/db";
import { MemberStatus } from "@prisma/client";
import { TypeofMemberData } from "@/validators/members";
import StatusCodes from "http-status-codes";
import { ApiError } from "@/utils/api-error";
import { TypeUserData } from "./users.validator";

export const getUsers = async (page: number = 1, limit: number = 10) => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  return apiResponse("Users fetched successfully", {
    users,
    pagination: {
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
};

//     export const createUser = async (userData: TypeUserData) => {
//   const { name, email, emailVerified, image } = userData;

//   const existingUser = await prisma.user.findFirst({
//     where: {
//       OR: [{ email }],
//     },
//   });

//   if (existingUser) {
//     throw new ApiError(StatusCodes.CONFLICT, "User already exists");
//   }

//   const user = await prisma.user.create({
//     data: {
//       name,
//       email,
//       emailVerified: emailVerified || false,
//       image,
//     },
//   });
//   return apiResponse("User created successfully", user);
// };

// export const getUserById = async (id: string) => {
//   const existingUser = await prisma.user.findUnique({
//     where: { id },
//   });
//   if (!existingUser) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
//   }

//   return apiResponse("User fetched successfully", existingUser);
// };

// export const updateMember = async (
//   id: string,
//   userData: Partial<TypeUserData>
// ) => {
//   const { name, email, emailVerified, image } = userData;

//   const existingUser = await prisma.user.findUnique({
//     where: { id },
//   });
//   if (!existingUser) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
//     }

//   const updatedUser = await prisma.user.update({
//     where: { id },
//     data: { name, email, emailVerified: emailVerified || false || true  , image },
//   });

//   return apiResponse("User updated successfully", updatedUser);
// };

// export const deleteUser = async (id: string) => {
//   const existingUser = await prisma.user.findUnique({
//     where: { id },
//   });

//   if (!existingUser) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
//   }

//   await prisma.user.delete({
//     where: { id: existingUser.id },
//   });

//   return apiResponse("User deleted successfully", null);
// };
