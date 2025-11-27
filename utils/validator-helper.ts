import { z } from "zod";
import { ApiError } from "./api-error";
import { StatusCodes } from "http-status-codes";

/**
 * Validate and parse a request body against a Zod schema.
 * Throws an ApiError if validation fails.
 */
export async function validateRequest<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await req.json();
    console.log(body, "body");
    const result = schema.safeParse(body);

    if (!result.success) {
      // Optional: collect validation messages for debugging

      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Invalid input. Please check your request data.",
        result.error.message // optional extra details
      );
    }

    return result.data;
  } catch (err) {
    // Catch JSON parsing errors (invalid JSON body)
    if (err instanceof SyntaxError) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid JSON format in request body."
      );
    }
    throw err;
  }
}
/**
 * Validate and parse a request body against a Zod schema.
 * Throws an ApiError if validation fails.
 */
export async function validateRequestFormData<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await req.formData();
    const formData = Object.fromEntries(body);
    console.log(formData);
    const result = schema.safeParse(formData);

    if (!result.success) {
      // Optional: collect validation messages for debugging

      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Invalid input. Please check your request data.",
        result.error.message // optional extra details
      );
    }

    return result.data;
  } catch (err) {
    // Catch JSON parsing errors (invalid JSON body)
    if (err instanceof SyntaxError) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid JSON format in request body."
      );
    }
    throw err;
  }
}
