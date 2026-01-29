import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { updateRequestSchema } from "@/lib/validators/request.schema";

// GET request by ID (HOSPITAL, NGO, DONOR)
export async function GET(req, context) {
  try {
    const role = req.headers.get("x-user-role");
    const params = await context.params;
    const requestId = Number(params.id);

    if (!["HOSPITAL", "NGO", "DONOR"].includes(role)) {
      return sendError("Access denied", "FORBIDDEN", 403);
    }

    if (isNaN(requestId)) {
      return sendError("Invalid request ID", "VALIDATION_ERROR", 400);
    }

    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      include: { hospital: true },
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

// UPDATE request status (HOSPITAL, own only)
export async function PUT(req, context) {
  try {
    const role = req.headers.get("x-user-role");
    const userId = Number(req.headers.get("x-user-id"));
    const params = await context.params;
    const requestId = Number(params.id);

    if (role !== "HOSPITAL")
      return sendError("Only hospitals can update requests", "FORBIDDEN", 403);
    if (isNaN(requestId))
      return sendError("Invalid request ID", "VALIDATION_ERROR", 400);

    const body = await req.json();

    // Safe validation
    const parsedBody = updateRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      console.log("Zod error:", parsedBody.error.format());
      const firstError =
        parsedBody.error?.errors?.[0]?.message || "Invalid input";
      return sendError(firstError, "VALIDATION_ERROR", 400);
    }

    // Fetch request + hospital
    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      include: { hospital: true },
    });

    if (!request) return sendError("Request not found", "NOT_FOUND", 404);
    if (!request.hospital || request.hospital.userId !== userId)
      return sendError(
        "You can only update your own requests",
        "FORBIDDEN",
        403
      );

    // Update request
    const updatedRequest = await prisma.bloodRequest.update({
      where: { id: requestId },
      data: parsedBody.data,
    });

    return sendSuccess(updatedRequest, "Request updated successfully");
  } catch (err) {
    console.error("Update request error:", err);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// DELETE request (blocked by design)
export async function DELETE() {
  return sendError("Deleting requests is not allowed", "FORBIDDEN", 403);
}
