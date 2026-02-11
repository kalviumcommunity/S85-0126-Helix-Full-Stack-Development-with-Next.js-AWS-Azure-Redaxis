import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { updateUserSchema } from "@/lib/validators/user.schema";
import { handleError } from "@/lib/errorHandler";

/* =========================
   Helpers
========================= */
function parseIntOrThrow(value, fieldName) {
  const num = Number(value);
  if (!Number.isInteger(num)) {
    const error = new Error(`Invalid ${fieldName}`);
    error.status = 400;
    error.type = "VALIDATION_ERROR";
    throw error;
  }
  return num;
}

/* =========================
   GET user by ID (self only)
========================= */
export async function GET(req, context) {
  try {
    const { params } = context;
    const awaitedParams = await params;

    const paramUserId = parseIntOrThrow(awaitedParams.id, "user ID");

    const tokenUserId = parseIntOrThrow(
      req.headers.get("x-user-id"),
      "user ID"
    );

    if (paramUserId !== tokenUserId) {
      return sendError("Access denied", "FORBIDDEN", 403);
    }

    const user = await prisma.user.findUnique({
      where: { id: paramUserId },
      include: {
        donor: true,
        hospital: true,
      },
    });

    if (!user) {
      return sendError("User not found", "NOT_FOUND", 404);
    }

    const { password, ...safeUser } = user;
    return sendSuccess(safeUser, "User fetched successfully");
  } catch (error) {
    return handleError(error, "GET /api/users/[id]");
  }
}

/* =========================
   UPDATE user (self only)
========================= */
export async function PUT(req, context) {
  try {
    const { params } = context;
    const awaitedParams = await params;

    const paramUserId = parseIntOrThrow(awaitedParams.id, "user ID");

    const tokenUserId = parseIntOrThrow(
      req.headers.get("x-user-id"),
      "user ID"
    );

    if (paramUserId !== tokenUserId) {
      return sendError("Access denied", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const parsedBody = updateUserSchema.safeParse(body);

    if (!parsedBody.success) {
      const error = new Error(
        parsedBody.error?.errors?.[0]?.message || "Invalid input"
      );
      error.status = 400;
      error.type = "VALIDATION_ERROR";
      throw error;
    }

    const updatedUser = await prisma.user.update({
      where: { id: paramUserId },
      data: parsedBody.data,
    });

    const { password, ...safeUser } = updatedUser;
    return sendSuccess(safeUser, "User updated successfully");
  } catch (error) {
    return handleError(error, "PUT /api/users/[id]");
  }
}

/* =========================
   DELETE user (self only)
========================= */
export async function DELETE(req, context) {
  try {
    const { params } = context;
    const awaitedParams = await params;

    const paramUserId = parseIntOrThrow(awaitedParams.id, "user ID");

    const tokenUserId = parseIntOrThrow(
      req.headers.get("x-user-id"),
      "user ID"
    );

    if (paramUserId !== tokenUserId) {
      return sendError("Access denied", "FORBIDDEN", 403);
    }

    await prisma.user.delete({
      where: { id: paramUserId },
    });

    return sendSuccess(null, "User deleted successfully");
  } catch (error) {
    return handleError(error, "DELETE /api/users/[id]");
  }
}
