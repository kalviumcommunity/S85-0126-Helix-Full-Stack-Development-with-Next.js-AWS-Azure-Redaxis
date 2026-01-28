import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { updateInventorySchema } from "@/lib/validators/inventory.schema";

// GET inventory by ID
export async function GET(req, context) {
  try {
    const inventoryId = Number(context.params.id);

    if (isNaN(inventoryId)) {
      return sendError("Invalid inventory ID", "VALIDATION_ERROR", 400);
    }

    const inventory = await prisma.bloodInventory.findUnique({
      where: { id: inventoryId },
      include: { hospital: true },
    });

    if (!inventory) {
      return sendError("Inventory not found", "NOT_FOUND", 404);
    }

    return sendSuccess(inventory, "Inventory fetched successfully");
  } catch (error) {
    console.error("Get inventory error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// UPDATE inventory
export async function PUT(req, context) {
  try {
    const inventoryId = Number(context.params.id);
    const body = await req.json();

    if (isNaN(inventoryId)) {
      return sendError("Invalid inventory ID", "VALIDATION_ERROR", 400);
    }

    const parsedBody = updateInventorySchema.safeParse(body);
    if (!parsedBody.success) {
      return sendError(
        parsedBody.error.errors[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const updatedInventory = await prisma.bloodInventory.update({
      where: { id: inventoryId },
      data: parsedBody.data,
    });

    return sendSuccess(updatedInventory, "Inventory updated successfully");
  } catch (error) {
    console.error("Update inventory error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// DELETE inventory
export async function DELETE(req, context) {
  try {
    const inventoryId = Number(context.params.id);

    if (isNaN(inventoryId)) {
      return sendError("Invalid inventory ID", "VALIDATION_ERROR", 400);
    }

    await prisma.bloodInventory.delete({
      where: { id: inventoryId },
    });

    return sendSuccess(null, "Inventory deleted successfully");
  } catch (error) {
    console.error("Delete inventory error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
