import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["en", "zh", "ja", "ko", "fr", "es"];

function detectLocale(request: NextRequest): string {
  // 1. Check cookie (set by next-intl)
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (localeCookie && SUPPORTED_LOCALES.includes(localeCookie)) return localeCookie;

  // 2. Check referer URL for locale prefix
  const referer = request.headers.get("referer") || "";
  const refMatch = referer.match(/\/(en|zh|ja|ko|fr|es)\//);
  if (refMatch) return refMatch[1];

  // 3. Check Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  if (acceptLang.startsWith("zh")) return "zh";
  if (acceptLang.startsWith("ja")) return "ja";
  if (acceptLang.startsWith("ko")) return "ko";

  return "en";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = detectLocale(request);
  const next = searchParams.get("next") ?? `/${locale}/assess`;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to auth page on error
  return NextResponse.redirect(`${origin}/${locale}/auth?error=auth_failed`);
}
