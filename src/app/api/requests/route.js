import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all blood requests
export async function GET() {
  try {
    const requests = await prisma.bloodRequest.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Get requests error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// CREATE blood request
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, bloodGroup, units } = body;

    if (!userId || !bloodGroup || units == null) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const request = await prisma.bloodRequest.create({
      data: {
        userId: Number(userId),
        bloodGroup,
        units: Number(units),
        status: "PENDING",
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("Create request error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
