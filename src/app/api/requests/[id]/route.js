import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { updateRequestSchema } from "@/lib/validators/request.schema";
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
   GET request by ID
   (HOSPITAL, NGO, DONOR)
========================= */
export async function GET(req, context) {
  try {
    const role = req.headers.get("x-user-role");

    if (!["HOSPITAL", "NGO", "DONOR"].includes(role)) {
      return sendError("Access denied", "FORBIDDEN", 403);
    }

    const { id } = context.params;
    const requestId = parseIntOrThrow(id, "request ID");

    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      include: { hospital: true },
    });

    if (!request) {
      return sendError("Request not found", "NOT_FOUND", 404);
    }

    return sendSuccess(request, "Request fetched successfully");
  } catch (error) {
    return handleError(error, "GET /api/requests/:id");
  }
}

/* =========================
   UPDATE request
   (HOSPITAL, own only)
========================= */
export async function PUT(req, context) {
  try {
    const role = req.headers.get("x-user-role");
    const userId = parseIntOrThrow(req.headers.get("x-user-id"), "user ID");

    if (role !== "HOSPITAL") {
      return sendError("Only hospitals can update requests", "FORBIDDEN", 403);
    }

    const { id } = context.params;
    const requestId = parseIntOrThrow(id, "request ID");

    const body = await req.json();
    const parsedBody = updateRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      const error = new Error(
        parsedBody.error?.errors?.[0]?.message || "Invalid input"
      );
      error.status = 400;
      error.type = "VALIDATION_ERROR";
      throw error;
    }

    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      include: { hospital: true },
    });

    if (!request) {
      return sendError("Request not found", "NOT_FOUND", 404);
    }

    if (!request.hospital || request.hospital.userId !== userId) {
      return sendError(
        "You can only update your own requests",
        "FORBIDDEN",
        403
      );
    }

    const updatedRequest = await prisma.bloodRequest.update({
      where: { id: requestId },
      data: parsedBody.data,
    });

    return sendSuccess(updatedRequest, "Request updated successfully");
  } catch (error) {
    return handleError(error, "PUT /api/requests/:id");
  }
}

/* =========================
   DELETE (blocked by design)
========================= */
export async function DELETE() {
  return sendError("Deleting requests is not allowed", "FORBIDDEN", 403);
}
