import { NextRequest, NextResponse } from "next/server";
import { PermissionManager } from "@/lib/permissions";

// Middleware to protect API routes
export async function withPermission(
  handler: (req: NextRequest) => Promise<NextResponse>,
  permission: string
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      await PermissionManager.requirePermission(permission);
      return await handler(req);
    } catch (error) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  };
}

// Middleware specifically for owner-only routes
export async function withOwnerPermission(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withPermission(handler, "MANAGE_USERS");
}

// Helper to create protected API handlers
export function createProtectedHandler(
  permission: string,
  handlers: {
    GET?: (req: NextRequest) => Promise<NextResponse>;
    POST?: (req: NextRequest) => Promise<NextResponse>;
    PUT?: (req: NextRequest) => Promise<NextResponse>;
    DELETE?: (req: NextRequest) => Promise<NextResponse>;
  }
) {
  const protectedHandlers: any = {};

  for (const [method, handler] of Object.entries(handlers)) {
    if (handler) {
      protectedHandlers[method] = withPermission(handler, permission);
    }
  }

  return protectedHandlers;
}
