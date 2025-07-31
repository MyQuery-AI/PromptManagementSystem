import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { PrismaClient } from "./app/generated/prisma";

// Define public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  // Test page if needed publicly
];

// Define dynamic public routes (with parameters)
const dynamicPublicRoutes = [
  "/register/setup", // Handles /register/setup/[otpId]
];

// Define API routes that should be publicly accessible
const publicApiRoutes = [
  "/api/auth", // All NextAuth API routes
];

// Define routes that should redirect to dashboard if user is already authenticated
const authRoutes = ["/login", "/register"];

// Helper function to check if a path matches any of the given routes
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });
}

export default auth(async (req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const auth = req.auth;
  const sessionUser = auth?.user;

  // Check if user is authenticated and email is verified
  const isLoggedIn = !!(sessionUser?.id && sessionUser?.emailVerifiedBoolean);
  const pathname = nextUrl.pathname;

  // Check if the current route is an API route
  const isApiRoute = pathname.startsWith("/api");

  // Check if the current route is a public API route
  const isPublicApiRoute = matchesRoute(pathname, publicApiRoutes);

  // Check if the current route is a public route
  const isPublicRoute =
    matchesRoute(pathname, publicRoutes) ||
    matchesRoute(pathname, dynamicPublicRoutes);

  // Check if the current route is an auth route (login/register)
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  // Handle API routes
  if (isApiRoute) {
    // Allow public API routes (NextAuth endpoints)
    if (isPublicApiRoute) {
      return NextResponse.next();
    }

    // Protect other API routes
    if (!isLoggedIn && !isPublicApiRoute) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Handle auth routes (login/register)
  if (isAuthRoute) {
    // If user is already logged in, redirect to dashboard
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
    }

    // Allow access to auth routes for non-authenticated users
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (!isLoggedIn && !isPublicRoute) {
    // Store the original URL to redirect back after login
    const callbackUrl = encodeURIComponent(pathname + nextUrl.search);

    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl.origin)
    );
  }

  // User is logged in and accessing a protected route
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except:
    // - Static files (_next/static)
    // - Image optimization (_next/image)
    // - Favicon and other static assets
    // - API routes that handle their own auth
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
