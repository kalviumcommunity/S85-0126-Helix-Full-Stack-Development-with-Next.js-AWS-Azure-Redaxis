import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, bloodGroup, units } = await req.json();

    const request = await prisma.$transaction(async (tx) => {
      // 1. Validate user
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      });

      if (!user || user.role !== "HOSPITAL") {
        throw new Error("Only hospitals can create blood requests");
      }

      // 2. Create blood request
      const bloodRequest = await tx.bloodRequest.create({
        data: {
          userId,
          bloodGroup,
          units,
          status: "PENDING",
        },
      });

      return bloodRequest;
    });

    return NextResponse.json({ success: true, data: request }, { status: 201 });
  } catch (error) {
    console.error("Blood request failed:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Blood request failed. Transaction rolled back.",
      },
      { status: 400 }
    );
  }
}

/**
 * GET → Optimized + paginated blood requests
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = 5;

  const requests = await prisma.bloodRequest.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      bloodGroup: true,
      units: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json({
    page,
    count: requests.length,
    data: requests,
  });
}
