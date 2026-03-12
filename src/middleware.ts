import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication
const PROTECTED_ROUTES = ["/history"];
// Routes that require admin role
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for API routes and static files
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // Check if this is a protected or admin route
  const localePrefix = pathname.match(/^\/(en|zh|ja|ko|fr|es)/)?.[0] || "";
  const pathWithoutLocale = pathname.replace(/^\/(en|zh|ja|ko|fr|es)/, "") || "/";

  const isProtected = PROTECTED_ROUTES.some((r) => pathWithoutLocale.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some((r) => pathWithoutLocale.startsWith(r));

  if (isProtected || isAdmin) {
    // Check Supabase auth
    const response = intlMiddleware(request);

    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        const locale = localePrefix.replace("/", "") || "en";
        return NextResponse.redirect(new URL(`/${locale}/auth`, request.url));
      }

      if (isAdmin) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "admin") {
          const locale = localePrefix.replace("/", "") || "en";
          return NextResponse.redirect(new URL(`/${locale}`, request.url));
        }
      }

      return response;
    } catch {
      // If Supabase is not configured, let the page handle auth
      return intlMiddleware(request);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|zh|ja|ko|fr|es)/:path*"],
};
