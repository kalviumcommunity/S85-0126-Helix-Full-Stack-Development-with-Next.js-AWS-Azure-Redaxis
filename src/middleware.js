import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const JWT_SECRET = process.env.JWT_SECRET;

// Public routes (no auth needed)
const PUBLIC_ROUTES = ["/api/auth/login", "/api/auth/signup"];

// Protected API prefixes
const PROTECTED_ROUTES = [
  "/api/inventory",
  "/api/requests",
  "/api/auth", // for /api/auth/[id]
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ✅ Only guard protected API routes
  if (!PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Authorization token missing" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verifyToken(token);
    // Attach user info for downstream APIs
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", String(decoded.id));
    requestHeaders.set("x-user-role", decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }
}

// Apply middleware only to API routes
export const config = {
  matcher: ["/api/:path*"],
};
