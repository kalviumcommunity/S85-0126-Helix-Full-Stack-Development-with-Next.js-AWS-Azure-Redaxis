import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { signupSchema } from "@/lib/validators/auth.schema";
import { handleError } from "@/lib/errorHandler";

export async function POST(req) {
  try {
    const body = await req.json();

    const parsedBody = signupSchema.safeParse(body);
    if (!parsedBody.success) {
      const error = new Error(
        parsedBody.error?.errors?.[0]?.message || "Invalid input"
      );
      error.status = 400;
      error.type = "VALIDATION_ERROR";
      throw error;
    }

    const { name, email, password, role, bloodGroup, city } = parsedBody.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

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

    const token = await signToken({
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
    return handleError(error, "POST /api/auth/signup");
  }
}
