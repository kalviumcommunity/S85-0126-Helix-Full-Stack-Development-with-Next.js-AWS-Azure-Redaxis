import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { handleError } from "@/lib/errorHandler";

export async function GET(req) {
  try {
    const userIdHeader = req.headers.get("x-user-id");

    if (!userIdHeader) {
      return sendError("Authentication required", "AUTH_ERROR", 401);
    }

    const userId = Number(userIdHeader);

    if (!Number.isInteger(userId)) {
      return sendError("Invalid user id", "VALIDATION_ERROR", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        donor: true,
        hospital: true,
      },
    });

    if (!user) {
      return sendError("User not found", "NOT_FOUND", 404);
    }

    const { password, ...safeUser } = user;

    return sendSuccess(safeUser, "Current user fetched successfully");
  } catch (error) {
    return handleError(error, "GET /api/auth/me");
  }
}

