import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import legacyRedirects from "@/data/wordpress-legacy-redirects.json";

const handleI18nRouting = createIntlMiddleware(routing);
const migratedStaticPaths: Record<string, string> = {
    "/blog": "/es/blog",
    "/eventos": "/es/eventos",
    "/evento": "/es/eventos",
    "/contacto": "/es/contacto",
};

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const legacyTarget = (legacyRedirects as Record<string, string>)[normalizedPath] ?? migratedStaticPaths[normalizedPath];

    if (legacyTarget) {
        const target = new URL(legacyTarget, request.url);
        target.search = request.nextUrl.search;
        return NextResponse.redirect(target, 308);
    }

    if (normalizedPath === "/event") {
        const target = new URL("/es/eventos", request.url);
        target.search = request.nextUrl.search;
        return NextResponse.redirect(target, 308);
    }

    const archivePage = normalizedPath.match(/^\/(blog|eventos)\/page\/\d+$/);
    if (archivePage) {
        const target = new URL(archivePage[1] === "blog" ? "/es/blog" : "/es/eventos", request.url);
        target.search = request.nextUrl.search;
        return NextResponse.redirect(target, 308);
    }

    const legacyTaxonomy = normalizedPath.match(/^\/(category|tag)\/([^/]+)$/);
    if (legacyTaxonomy) {
        const target = new URL(`/es/${legacyTaxonomy[1]}/${legacyTaxonomy[2]}`, request.url);
        target.search = request.nextUrl.search;
        return NextResponse.redirect(target, 308);
    }

    // Keep one canonical URL for new routes while accepting the trailing slash
    // used by WordPress long enough to resolve legacy paths above in one hop.
    if (pathname.length > 1 && pathname.endsWith("/")) {
        const target = new URL(normalizedPath, request.url);
        target.search = request.nextUrl.search;
        return NextResponse.redirect(target, 308);
    }

    if (
        pathname === "/robots.txt" ||
        pathname === "/sitemap.xml" ||
        pathname === "/api/exchange-rate" ||
        pathname === "/api/cron/form-notifications"
    ) {
        return NextResponse.next();
    }

    const applicationPath = ["/api", "/auth", "/admin", "/dashboard", "/login", "/register", "/forgot-password", "/reset-password"]
        .some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    if (!applicationPath) return handleI18nRouting(request);

    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|pdf|docx|mp4|webm)$).*)",
    ],
};
