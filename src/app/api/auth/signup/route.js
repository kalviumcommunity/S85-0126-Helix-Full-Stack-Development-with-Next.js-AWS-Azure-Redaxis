import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { sendSuccess, sendError } from "@/lib/responseHandler";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, bloodGroup, city } = body;

    if (!name || !email || !password || !role) {
      return sendError("Missing required fields", "VALIDATION_ERROR", 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError("User already exists", "CONFLICT_ERROR", 409);
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
                create: { bloodGroup, city },
              }
            : undefined,
        hospital:
          role === "HOSPITAL"
            ? {
                create: { name, city },
              }
            : undefined,
      },
      include: { donor: true, hospital: true },
    });

    const { password: _, ...safeUser } = user;
    return sendSuccess(safeUser, "User created successfully", 201);
  } catch (error) {
    console.error("Signup error:", error);
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}
