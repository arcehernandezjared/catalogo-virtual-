import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/products") || pathname.startsWith("/api/upload") || pathname.startsWith("/api/settings");
  const isMutatingApi = isAdminApi && request.method !== "GET";

  if (isAdminPage || isMutatingApi) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const isValid = await verifyAdminToken(token);

    if (!isValid) {
      if (isAdminPage) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/upload/:path*", "/api/settings/:path*"],
};
