import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/robots.txt" || pathname === "/sitemap.xml" || pathname === "/api/exchange-rate") {
        return NextResponse.next();
    }

    if (
        pathname === "/" ||
        pathname === "/cumbre-sigue-2026" ||
        pathname === "/es" ||
        pathname.startsWith("/es/") ||
        pathname === "/en" ||
        pathname.startsWith("/en/")
    ) {
        return handleI18nRouting(request);
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
    ],
};
