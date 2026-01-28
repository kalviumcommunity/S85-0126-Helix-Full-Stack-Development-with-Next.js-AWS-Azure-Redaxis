import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { createInventorySchema } from "@/lib/validators/inventory.schema";

// GET all inventories
export async function GET() {
  try {
    const inventories = await prisma.bloodInventory.findMany({
      include: { hospital: true },
    });

    return sendSuccess(inventories, "Inventories fetched successfully");
  } catch (error) {
    console.error("Get inventories error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// CREATE new inventory
export async function POST(req) {
  try {
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

    const inventory = await prisma.bloodInventory.create({
      data: {
        hospitalId,
        bloodGroup,
        units,
      },
    });

    return sendSuccess(inventory, "Inventory created successfully", 201);
  } catch (error) {
    console.error("Create inventory error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
