import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";
import { sendSuccess, sendError } from "@/lib/responseHandler";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return sendError(
        "Email and password are required",
        "VALIDATION_ERROR",
        400
      );
    }

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

    const { password: _, ...safeUser } = user;

    return sendSuccess(safeUser, "Login successful", 200);
  } catch (error) {
    console.error("Login error:", error);
    return sendError(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      error.message
    );
  }
}
