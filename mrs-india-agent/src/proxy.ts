import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    if (nextUrl.pathname !== "/login") {
      loginUrl.searchParams.set(
        "callbackUrl",
        nextUrl.pathname + nextUrl.search
      );
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
