import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { createRequestSchema } from "@/lib/validators/request.schema";

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
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// CREATE a new blood request
export async function POST(req) {
  try {
    const body = await req.json();

    const parsedBody = createRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendError(
        parsedBody.error.errors[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const { userId, bloodGroup, units } = parsedBody.data;

    const request = await prisma.bloodRequest.create({
      data: {
        userId,
        bloodGroup,
        units,
        status: "PENDING",
      },
    });

    return sendSuccess(request, "Blood request created successfully", 201);
  } catch (error) {
    console.error("Create request error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
