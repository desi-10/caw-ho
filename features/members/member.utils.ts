import { prisma } from "@/utils/db";

export const findMemberById = async (id: string) => {
  return await prisma.member.findUnique({
    where: { id },
  });
};
