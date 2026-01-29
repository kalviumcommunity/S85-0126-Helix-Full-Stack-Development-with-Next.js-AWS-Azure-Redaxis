import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { loginSchema } from "@/lib/validators/auth.schema";

export async function POST(req) {
  try {
    const body = await req.json();

    const parsedBody = loginSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendError(
        parsedBody.error.errors[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const { email, password } = parsedBody.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        donor: true,
        hospital: true,
      },
    });

    if (!user || !user.password) {
      return sendError("Invalid credentials", "AUTH_ERROR", 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendError("Invalid credentials", "AUTH_ERROR", 401);
    }

    // 🔐 JWT payload (keep it minimal)
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
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
