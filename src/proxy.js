import { NextResponse } from "next/server";

const AUTH_PAGES = ["/login", "/forgot-password"];

function isAuthPage(pathname) {
  return AUTH_PAGES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isPublicAsset(pathname) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth/session") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("akhf_token")?.value;
  const isAuthenticated = Boolean(token);

  if (pathname === "/") {
    const destination = isAuthenticated
      ? "/opd/patient-registration"
      : "/login";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (!isAuthenticated && !isAuthPage(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthPage(pathname)) {
    return NextResponse.redirect(
      new URL("/opd/patient-registration", request.url),
    );
  }

  const response = NextResponse.next();

  if (isAuthPage(pathname)) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
