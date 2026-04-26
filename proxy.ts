import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSessionServer } from "./lib/api/serverApi";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const privateRoutes = ["/profile", "/notes", "/notes/filter"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken && refreshToken) {
    try {
      const data = await checkSessionServer();
      const setCookie = data.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        const response = isPublicRoute
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next();

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const entries = Object.entries(parsed);

          if (entries.length > 0) {
            const [cookieName, cookieValue] = entries[0];

            if (cookieValue !== undefined) {
              const options: Partial<ResponseCookie> = {
                path: parsed.Path || "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              };

              if (parsed.Expires) options.expires = new Date(parsed.Expires);
              if (parsed["Max-Age"]) {
                const maxAge = Number(parsed["Max-Age"]);
                if (!isNaN(maxAge)) options.maxAge = maxAge;
              }

              response.cookies.set(cookieName, cookieValue, options);
              request.headers.set("cookie", `${cookieName}=${cookieValue}`);
            }
          }
        }
        return response;
      }
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  }

  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up", "/notes/:path*"],
};
