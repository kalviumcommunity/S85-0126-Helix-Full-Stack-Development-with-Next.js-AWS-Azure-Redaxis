import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, role, bloodGroup, city, hospitalName } =
      await req.json();

    const user = await prisma.$transaction(async (tx) => {
      // 1. Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          role,
        },
      });

      // 2. Role-based profile creation
      if (role === "DONOR") {
        await tx.donorProfile.create({
          data: {
            bloodGroup,
            city,
            userId: newUser.id,
          },
        });
      }

      if (role === "HOSPITAL") {
        await tx.hospital.create({
          data: {
            name: hospitalName,
            city,
            userId: newUser.id,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error("Signup failed:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Signup failed. Transaction rolled back.",
      },
      { status: 400 }
    );
  }
}
