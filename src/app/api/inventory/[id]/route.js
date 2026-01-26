import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const inventoryId = Number(id);

    if (isNaN(inventoryId)) {
      return NextResponse.json(
        { message: "Invalid inventory ID" },
        { status: 400 }
      );
    }

    const inventory = await prisma.bloodInventory.findUnique({
      where: { id: inventoryId },
      include: {
        hospital: true,
      },
    });

    if (!inventory) {
      return NextResponse.json(
        { message: "Inventory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(inventory, { status: 200 });
  } catch (error) {
    console.error("Get inventory error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const inventoryId = Number(id);
    const body = await req.json();

    if (isNaN(inventoryId)) {
      return NextResponse.json(
        { message: "Invalid inventory ID" },
        { status: 400 }
      );
    }

    const updatedInventory = await prisma.bloodInventory.update({
      where: { id: inventoryId },
      data: {
        bloodGroup: body.bloodGroup,
        units: body.units,
      },
    });

    return NextResponse.json(updatedInventory, { status: 200 });
  } catch (error) {
    console.error("Update inventory error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const inventoryId = Number(id);

    if (isNaN(inventoryId)) {
      return NextResponse.json(
        { message: "Invalid inventory ID" },
        { status: 400 }
      );
    }

    await prisma.bloodInventory.delete({
      where: { id: inventoryId },
    });

    return NextResponse.json(
      { message: "Inventory deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete inventory error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
