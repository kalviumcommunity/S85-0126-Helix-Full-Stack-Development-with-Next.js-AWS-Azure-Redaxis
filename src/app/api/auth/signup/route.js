import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { signupSchema } from "@/lib/validators/auth.schema";

export async function POST(req) {
  try {
    const body = await req.json();

    const parsedBody = signupSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendError(
        parsedBody.error.errors[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const { name, email, password, role, bloodGroup, city } = parsedBody.data;

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
        donor: role === "DONOR" ? { create: { bloodGroup, city } } : undefined,
        hospital: role === "HOSPITAL" ? { create: { name, city } } : undefined,
      },
      include: {
        donor: true,
        hospital: true,
      },
    });

    // 🔐 Auto-login token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...safeUser } = user;

    return sendSuccess(
      {
        user: safeUser,
        token,
      },
      "User created successfully",
      201
    );
  } catch (error) {
    console.error("Signup error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
