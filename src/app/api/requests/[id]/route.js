import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { updateRequestSchema } from "@/lib/validators/request.schema";

// GET BloodRequest by ID
export async function GET(req, context) {
  try {
    const requestId = Number(context.params.id);

    if (isNaN(requestId)) {
      return sendError("Invalid request ID", "VALIDATION_ERROR", 400);
    }

    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) {
      return sendError("Request not found", "NOT_FOUND", 404);
    }

    return sendSuccess(request, "Request fetched successfully");
  } catch (error) {
    console.error("Get request error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// UPDATE BloodRequest status
export async function PUT(req, context) {
  try {
    const requestId = Number(context.params.id);
    const body = await req.json();

    if (isNaN(requestId)) {
      return sendError("Invalid request ID", "VALIDATION_ERROR", 400);
    }

    const parsedBody = updateRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendError(
        parsedBody.error.errors[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const updatedRequest = await prisma.bloodRequest.update({
      where: { id: requestId },
      data: parsedBody.data,
    });

    return sendSuccess(updatedRequest, "Request updated successfully");
  } catch (error) {
    console.error("Update request error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// DELETE BloodRequest
export async function DELETE(req, context) {
  try {
    const requestId = Number(context.params.id);

    if (isNaN(requestId)) {
      return sendError("Invalid request ID", "VALIDATION_ERROR", 400);
    }

    await prisma.bloodRequest.delete({
      where: { id: requestId },
    });

    return sendSuccess(null, "Request deleted successfully");
  } catch (error) {
    console.error("Delete request error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
