import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";

// GET all inventories
export async function GET() {
  try {
    const inventories = await prisma.bloodInventory.findMany({
      include: { hospital: true },
    });

    return sendSuccess(inventories, "Inventories fetched successfully");
  } catch (error) {
    console.error("Get inventories error:", error);
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}

// CREATE new inventory
export async function POST(req) {
  try {
    const body = await req.json();
    const { hospitalId, bloodGroup, units } = body;

    if (!hospitalId || !bloodGroup || units == null) {
      return sendError("Missing required fields", "VALIDATION_ERROR", 400);
    }

    const inventory = await prisma.bloodInventory.create({
      data: {
        hospitalId: Number(hospitalId),
        bloodGroup,
        units: Number(units),
      },
    });

    return sendSuccess(inventory, "Inventory created successfully", 201);
  } catch (error) {
    console.error("Create inventory error:", error);
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}
