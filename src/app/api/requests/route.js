import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { createRequestSchema } from "@/lib/validators/request.schema";
import { handleError } from "@/lib/errorHandler";
import redis from "@/lib/redis";

// GET all blood requests (HOSPITAL, NGO, DONOR)
export async function GET(req) {
  try {
    const role = req.headers.get("x-user-role");

    if (!["HOSPITAL", "NGO", "DONOR"].includes(role)) {
      return sendError("Access denied", "FORBIDDEN", 403);
    }

    const cacheKey = "blood_requests:all";

    // 🔍 1. Check Redis cache
    const cachedRequests = await redis.get(cacheKey);
    if (cachedRequests) {
      console.log("⚡ Cache HIT: blood_requests");
      return sendSuccess(
        JSON.parse(cachedRequests),
        "Blood requests fetched successfully (cached)"
      );
    }

    console.log("🐢 Cache MISS: fetching blood requests from DB");

    // 🐘 2. Fetch from DB
    const requests = await prisma.bloodRequest.findMany({
      include: { hospital: true },
      orderBy: { createdAt: "desc" },
    });

    // ⏱ 3. Store in cache (TTL = 60s)
    await redis.set(cacheKey, JSON.stringify(requests), "EX", 60);

    return sendSuccess(requests, "Blood requests fetched successfully");
  } catch (error) {
    return handleError(error, "GET /api/requests");
  }
}

// CREATE blood request (HOSPITAL only, own hospital)
export async function POST(req) {
  try {
    const role = req.headers.get("x-user-role");
    const userId = Number(req.headers.get("x-user-id"));

    if (role !== "HOSPITAL") {
      return sendError("Only hospitals can create requests", "FORBIDDEN", 403);
    }

    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) {
      return sendError("Hospital not found", "FORBIDDEN", 403);
    }

    const body = await req.json();

    const parsedBody = createRequestSchema.safeParse({
      ...body,
      userId,
      hospitalId: hospital.id,
    });

    if (!parsedBody.success) {
      const firstError =
        parsedBody.error?.errors?.[0]?.message || "Invalid input";
      return sendError(firstError, "VALIDATION_ERROR", 400);
    }

    const { bloodGroup, units } = parsedBody.data;

    const request = await prisma.bloodRequest.create({
      data: {
        hospitalId: hospital.id,
        bloodGroup,
        units,
        status: "PENDING",
      },
    });

    // ❌ Invalidate cache after write
    await redis.del("blood_requests:all");

    return sendSuccess(request, "Blood request created successfully", 201);
  } catch (error) {
    return handleError(error, "POST /api/requests");
  }
}
