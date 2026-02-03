import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { updateInventorySchema } from "@/lib/validators/inventory.schema";
import { handleError } from "@/lib/errorHandler";

// GET inventory by ID (HOSPITAL, NGO)
export async function GET(req, context) {
  try {
    const role = req.headers.get("x-user-role");
    const params = context.params;
    const inventoryId = Number(params.id);

    if (!["HOSPITAL", "NGO"].includes(role)) {
      return sendError("Access denied", "FORBIDDEN", 403);
    }

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
    return handleError(error, "GET /api/inventory/[id]");
  }
}

// UPDATE inventory (HOSPITAL, own only)
export async function PUT(req, context) {
  try {
    const role = req.headers.get("x-user-role");
    const userId = Number(req.headers.get("x-user-id"));
    const params = context.params;
    const inventoryId = Number(params.id);

    if (role !== "HOSPITAL") {
      return sendError("Only hospitals can update inventory", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const parsedBody = updateInventorySchema.safeParse(body);

    if (!parsedBody.success) {
      return sendError(
        parsedBody.error.errors[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const inventory = await prisma.bloodInventory.findUnique({
      where: { id: inventoryId },
      include: { hospital: true },
    });

    if (!inventory || inventory.hospital.userId !== userId) {
      return sendError(
        "You can only update your own inventory",
        "FORBIDDEN",
        403
      );
    }

    const updatedInventory = await prisma.bloodInventory.update({
      where: { id: inventoryId },
      data: parsedBody.data,
    });

    return sendSuccess(updatedInventory, "Inventory updated successfully");
  } catch (error) {
    return handleError(error, "PUT /api/inventory/[id]");
  }
}

// DELETE inventory (HOSPITAL, own only)
export async function DELETE(req, context) {
  try {
    const role = req.headers.get("x-user-role");
    const userId = Number(req.headers.get("x-user-id"));
    const params = context.params;
    const inventoryId = Number(params.id);

    if (role !== "HOSPITAL") {
      return sendError("Only hospitals can delete inventory", "FORBIDDEN", 403);
    }

    const inventory = await prisma.bloodInventory.findUnique({
      where: { id: inventoryId },
      include: { hospital: true },
    });

    if (!inventory || inventory.hospital.userId !== userId) {
      return sendError(
        "You can only delete your own inventory",
        "FORBIDDEN",
        403
      );
    }

    await prisma.bloodInventory.delete({
      where: { id: inventoryId },
    });

    return sendSuccess(null, "Inventory deleted successfully");
  } catch (error) {
    return handleError(error, "DELETE /api/inventory/[id]");
  }
}
