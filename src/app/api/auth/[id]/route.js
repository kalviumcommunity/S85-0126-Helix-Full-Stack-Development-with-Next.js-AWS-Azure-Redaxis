import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { updateUserSchema } from "@/lib/validators/user.schema";

// GET user by ID
export async function GET(req, context) {
  try {
    const userId = Number(context.params.id);

    if (!Number.isInteger(userId)) {
      return sendError("Invalid user ID", "VALIDATION_ERROR", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        donor: true,
        hospital: true,
        requests: true,
      },
    });

    if (!user) {
      return sendError("User not found", "NOT_FOUND", 404);
    }

    const { password, ...safeUser } = user;
    return sendSuccess(safeUser, "User fetched successfully");
  } catch (error) {
    console.error(error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// UPDATE user
export async function PUT(req, context) {
  try {
    const userId = Number(context.params.id);

    if (!Number.isInteger(userId)) {
      return sendError("Invalid user ID", "VALIDATION_ERROR", 400);
    }

    const body = await req.json();

    const parsedBody = updateUserSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendError(
        parsedBody.error.errors[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: parsedBody.data,
    });

    const { password, ...safeUser } = updatedUser;
    return sendSuccess(safeUser, "User updated successfully");
  } catch (error) {
    console.error(error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// DELETE user
export async function DELETE(req, context) {
  try {
    const userId = Number(context.params.id);

    if (!Number.isInteger(userId)) {
      return sendError("Invalid user ID", "VALIDATION_ERROR", 400);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return sendSuccess(null, "User deleted successfully");
  } catch (error) {
    console.error(error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
