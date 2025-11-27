import { NextResponse } from "next/server";
import { asyncHandler } from "@/utils/async-handler";
import * as userService from "@/features/users/users.service";

export const GET = asyncHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const result = await userService.getUsers(page, limit);
  return NextResponse.json(result);
});
