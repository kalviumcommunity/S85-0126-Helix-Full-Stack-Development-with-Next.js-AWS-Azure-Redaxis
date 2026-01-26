import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const inventory = await prisma.bloodInventory.findMany({
      include: {
        hospital: true,
      },
    });

    return NextResponse.json(inventory, { status: 200 });
  } catch (error) {
    console.error("Get inventory error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { hospitalId, bloodGroup, units } = body;

    if (!hospitalId || !bloodGroup || units == null) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const inventory = await prisma.bloodInventory.create({
      data: {
        hospitalId: Number(hospitalId),
        bloodGroup,
        units: Number(units),
      },
    });

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    console.error("Create inventory error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
