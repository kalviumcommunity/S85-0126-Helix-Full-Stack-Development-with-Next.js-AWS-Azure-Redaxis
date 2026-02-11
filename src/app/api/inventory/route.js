import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { createInventorySchema } from "@/lib/validators/inventory.schema";
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
   GET all inventories
   (HOSPITAL, NGO)
========================= */
export async function GET(req) {
  try {
    const role = req.headers.get("x-user-role");

    if (!["HOSPITAL", "NGO"].includes(role)) {
      return sendError("Access denied", "FORBIDDEN", 403);
    }

    const inventories = await prisma.bloodInventory.findMany({
      include: { hospital: true },
    });

    return sendSuccess(inventories, "Inventories fetched successfully");
  } catch (error) {
    return handleError(error, "GET /api/inventory");
  }
}

/* =========================
   CREATE inventory
   (HOSPITAL → own hospital)
========================= */
export async function POST(req) {
  try {
    const role = req.headers.get("x-user-role");
    const userId = parseIntOrThrow(req.headers.get("x-user-id"), "user ID");

    if (role !== "HOSPITAL") {
      return sendError("Only hospitals can create inventory", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const parsedBody = createInventorySchema.safeParse(body);

    if (!parsedBody.success) {
      const error = new Error(
        parsedBody.error.errors[0]?.message || "Invalid input"
      );
      error.status = 400;
      error.type = "VALIDATION_ERROR";
      throw error;
    }

    const { hospitalId, bloodGroup, units, expiryDate } = parsedBody.data;

    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital || hospital.id !== hospitalId) {
      return sendError(
        "You can only create inventory for your own hospital",
        "FORBIDDEN",
        403
      );
    }

    const inventory = await prisma.bloodInventory.create({
      data: {
        hospitalId,
        bloodGroup,
        units,
        expiryDate,
      },
    });

    return sendSuccess(inventory, "Inventory created successfully", 201);
  } catch (error) {
    return handleError(error, "POST /api/inventory");
  }
}
