import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/resetProfile") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const jwtToken = request.cookies.get("token")?.value;
  let user = null;

  if (jwtToken) {
    try {
      user = await verifyJWT(jwtToken); // custom JWT
    } catch (err) {
      user = null;
    }
  }

  // Try getting user from NextAuth token (for Google logins)
  if (!user) {
    const nextAuthToken = await getToken({ req: request });

    if (nextAuthToken) {
      user = {
        id: nextAuthToken.id,
        role: nextAuthToken.role || "user",
      };
    }
  }

  if (!user) {
    const redirectTo = pathname.startsWith("/admin")
      ? "/admin/login"
      : "/login";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Role based protection
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/user") && user.role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  console.log("✅ Authenticated user:", user);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
