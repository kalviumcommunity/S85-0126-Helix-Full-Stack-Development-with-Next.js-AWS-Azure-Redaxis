import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";

// GET all blood requests
export async function GET() {
  try {
    const requests = await prisma.bloodRequest.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(requests, "Blood requests fetched successfully");
  } catch (error) {
    console.error("Get requests error:", error);
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}

// CREATE a new blood request
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, bloodGroup, units } = body;

    if (!userId || !bloodGroup || units == null) {
      return sendError("Missing required fields", "VALIDATION_ERROR", 400);
    }

    const request = await prisma.bloodRequest.create({
      data: {
        userId: Number(userId),
        bloodGroup,
        units: Number(units),
        status: "PENDING",
      },
    });

    return sendSuccess(request, "Blood request created successfully", 201);
  } catch (error) {
    console.error("Create request error:", error);
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}
