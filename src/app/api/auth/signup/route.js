import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, password, role, bloodGroup, city } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        donor:
          role === "DONOR"
            ? {
                create: {
                  bloodGroup,
                  city,
                },
              }
            : undefined,
        hospital:
          role === "HOSPITAL"
            ? {
                create: {
                  name,
                  city,
                },
              }
            : undefined,
      },
      include: {
        donor: true,
        hospital: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
