export function asyncHandler<
  T extends (...args: any[]) => Promise<Response> | Response
>(fn: T) {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (err: any) {
      console.error("❌ AsyncHandler Error:", err);

      const message =
        err instanceof Error
          ? err.message || "Internal Server Error"
          : "An unexpected error occurred";

      const status =
        err instanceof Error && "statusCode" in err ? err.statusCode : 500;

      return new Response(
        JSON.stringify({
          success: false,
          message,
          ...(err.details ? { details: err.details } : {}),
        }),
        {
          status: typeof status === "number" ? status : 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}
