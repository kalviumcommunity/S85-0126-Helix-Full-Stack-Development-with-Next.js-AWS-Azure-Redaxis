import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { loginSchema } from "@/lib/validators/auth.schema";
import { handleError } from "@/lib/errorHandler";

const AUTH_COOKIE_NAME = "auth_token";

export async function POST(req) {
  try {
    const body = await req.json();

    const parsedBody = loginSchema.safeParse(body);
    if (!parsedBody.success) {
      const error = new Error(
        parsedBody.error?.errors?.[0]?.message || "Invalid input"
      );
      error.status = 400;
      error.type = "VALIDATION_ERROR";
      throw error;
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

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...safeUser } = user;

    const response = sendSuccess(
      {
        user: safeUser,
        token,
      },
      "Login successful"
    );

    // Set httpOnly JWT cookie for authentication
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    return handleError(error, "POST /api/auth/login");
  }
}
