import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";

// GET user by ID
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (isNaN(userId)) {
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
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}

// UPDATE user
export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const userId = Number(id);
    const body = await req.json();

    if (isNaN(userId)) {
      return sendError("Invalid user ID", "VALIDATION_ERROR", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email,
      },
    });

    const { password, ...safeUser } = updatedUser;
    return sendSuccess(safeUser, "User updated successfully");
  } catch (error) {
    console.error(error);
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}

// DELETE user
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (isNaN(userId)) {
      return sendError("Invalid user ID", "VALIDATION_ERROR", 400);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return sendSuccess(null, "User deleted successfully");
  } catch (error) {
    console.error(error);
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}
