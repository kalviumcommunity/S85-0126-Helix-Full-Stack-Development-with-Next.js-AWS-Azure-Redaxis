import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const AUTH_COOKIE_NAME = "auth_token";

// Public API routes (no auth needed)
const PUBLIC_API_ROUTES = ["/api/auth/login", "/api/auth/signup"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api");

  // Allow public auth APIs without a token
  if (
    isApiRoute &&
    PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  // No token → reject APIs, redirect protected pages
  if (!token) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = await verifyToken(token);

    const role = decoded.role;
    const userId = decoded.id;

    // Attach user info for downstream APIs
    const requestHeaders = new Headers(req.headers);
    if (userId) requestHeaders.set("x-user-id", String(userId));
    if (role) requestHeaders.set("x-user-role", role);

    // Role-based page protection
    if (pathname.startsWith("/donor") && role !== "DONOR") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, req.url));
    }

    if (pathname.startsWith("/hospital") && role !== "HOSPITAL") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, req.url));
    }

    if (pathname.startsWith("/ngo") && role !== "NGO") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, req.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 403 }
      );
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Apply middleware to API and protected app routes
export const config = {
  matcher: [
    "/api/:path*",
    "/donor/:path*",
    "/hospital/:path*",
    "/ngo/:path*",
    "/profile",
  ],
};
