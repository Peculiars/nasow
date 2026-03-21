import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/about",
    "/contact",
    "/events",
    "/executives",
    "/lecturers",
    "/nasowite-of-the-week",
    "/terms",
  ];

  // Allow all /api routes (including Kinde auth)
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  return withAuth(req, {
    isReturnToCurrentPage: true,
    loginPage: "/login",
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|public).*)",
  ],
};