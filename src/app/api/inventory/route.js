import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { createInventorySchema } from "@/lib/validators/inventory.schema";
import { handleError } from "@/lib/errorHandler";

// GET all inventories (HOSPITAL, NGO)
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

// CREATE inventory (HOSPITAL only, own hospital)
export async function POST(req) {
  try {
    const role = req.headers.get("x-user-role");
    const userId = Number(req.headers.get("x-user-id"));

    if (role !== "HOSPITAL") {
      return sendError("Only hospitals can create inventory", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const parsedBody = createInventorySchema.safeParse(body);

    if (!parsedBody.success) {
      return sendError(
        parsedBody.error.errors[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const { hospitalId, bloodGroup, units } = parsedBody.data;

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
      },
    });

    return sendSuccess(inventory, "Inventory created successfully", 201);
  } catch (error) {
    return handleError(error, "POST /api/inventory");
  }
}
