import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import legacyRedirects from "@/data/wordpress-legacy-redirects.json";

const handleI18nRouting = createIntlMiddleware(routing);
const retiredSegments = new Set([
    "event-organizers", "event-venues", "my-calendar", "organizer-dashboard",
    "submit-organizer-form", "submit-venue-form", "venue-dashboard",
    "carrito", "checkout", "finalizar-compra", "mi-cuenta", "cart",
    "my-account", "shop", "tienda", "product-category", "product-tag",
    "product", "producto",
]);
const retiredSitemaps = new Set([
    "/wp-sitemap.xml", "/sitemap_index.xml", "/post-sitemap.xml",
    "/page-sitemap.xml", "/edge-event-sitemap.xml", "/product-sitemap.xml",
    "/mailpoet_page-sitemap.xml", "/category-sitemap.xml",
]);

function retiredResponse() {
    return new NextResponse("Esta página fue retirada.", {
        status: 410,
        headers: {
            "content-type": "text/plain; charset=utf-8",
            "x-robots-tag": "noindex",
            "cache-control": "no-store",
        },
    });
}
const migratedStaticPaths: Record<string, string> = {
    "/blog": "/es/blog",
    "/eventos": "/es/eventos",
    "/evento": "/es/eventos",
    "/contacto": "/es/contacto",
    "/herramientas-y-guias": "/es/herramientas",
    "/es/herramientas-y-guias": "/es/herramientas",
    "/en/herramientas-y-guias": "/en/herramientas",
};

const applicationPrefixes = ["/api", "/auth", "/admin", "/dashboard", "/login", "/register", "/forgot-password", "/reset-password"];

function isApplicationPath(pathname: string) {
    return applicationPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * WordPress archive URLs that have no page of their own in the app: feeds,
 * author and date archives, and paginated listings. Each resolves in one
 * permanent redirect to the closest living page instead of ending in a 404.
 */
function resolveArchivePath(wordpressPath: string, locale: string): string | null {
    const cleanPath = wordpressPath
        .replace(/\/feed(?:\/(?:rss2?|rdf|atom))?$/, "")
        .replace(/\/page\/\d+$/, "");
    const hadSuffix = cleanPath !== wordpressPath;

    if (/^\/author(?:\/|$)/.test(cleanPath)) return `/${locale}/blog`;

    const dateArchive = cleanPath.match(/^\/\d{4}(?:\/\d{1,2}){0,2}(?:\/([^/]+))?$/);
    if (dateArchive) {
        const post = dateArchive[1] ? (legacyRedirects as Record<string, string>)[`/${dateArchive[1]}`] : undefined;
        return post ?? `/${locale}/blog`;
    }

    if (!hadSuffix) return null;
    if (cleanPath === "" || cleanPath === "/comments" || cleanPath === "/blog") return `/${locale}/blog`;
    if (cleanPath === "/eventos" || cleanPath === "/evento" || cleanPath === "/event") return `/${locale}/eventos`;
    return (legacyRedirects as Record<string, string>)[cleanPath] ?? `/${locale}${cleanPath}`;
}

/** next-intl answers with 307 when it adds the locale prefix; the move is permanent. */
function asPermanentRedirect(response: NextResponse) {
    if (response.status !== 307 || !response.headers.has("location")) return response;
    return new NextResponse(null, { status: 308, headers: response.headers });
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const localePrefix = normalizedPath.match(/^\/(es|en)(?=\/|$)/)?.[1];
    const wordpressPath = normalizedPath.replace(/^\/(?:es|en)(?=\/)/, "");
    const firstSegment = wordpressPath.split("/")[1];

    if (wordpressPath === "/wp-admin" || wordpressPath.startsWith("/wp-admin/") || wordpressPath === "/wp-login.php") {
        const target = new URL(request.url);
        target.hostname = "wp.siguenetwork.org";
        target.port = "";
        target.pathname = wordpressPath;
        return NextResponse.redirect(target, request.method === "GET" || request.method === "HEAD" ? 302 : 307);
    }

    if (
        retiredSegments.has(firstSegment) ||
        retiredSitemaps.has(wordpressPath) ||
        (wordpressPath.startsWith("/wp-") && !wordpressPath.startsWith("/wp-content/")) ||
        request.nextUrl.searchParams.has("wc-ajax") ||
        request.nextUrl.searchParams.has("wc-api") ||
        request.nextUrl.searchParams.has("add-to-cart") ||
        request.nextUrl.searchParams.has("rest_route")
    ) {
        return retiredResponse();
    }
    const archiveTarget = isApplicationPath(normalizedPath) ? null : resolveArchivePath(wordpressPath, localePrefix ?? "es");
    if (archiveTarget) {
        const target = new URL(archiveTarget, request.url);
        target.search = "";
        return NextResponse.redirect(target, 308);
    }

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
        // Old WordPress pages had no locale prefix and were Spanish: add it here
        // so they reach their page in one hop instead of two.
        const needsLocale = !localePrefix
            && !isApplicationPath(normalizedPath)
            && !normalizedPath.startsWith("/wp-content/")
            && !/\.[a-z0-9]+$/i.test(normalizedPath);
        const target = new URL(needsLocale ? `/es${normalizedPath}` : normalizedPath, request.url);
        target.search = request.nextUrl.search;
        return NextResponse.redirect(target, 308);
    }

    if (
        pathname === "/robots.txt" ||
        pathname === "/sitemap.xml" ||
        pathname.startsWith("/wp-content/") ||
        pathname === "/api/exchange-rate" ||
        pathname === "/api/cron/form-notifications"
    ) {
        return NextResponse.next();
    }

    if (!isApplicationPath(pathname)) return asPermanentRedirect(handleI18nRouting(request));

    return await updateSession(request);
}

export const config = {
    matcher: [
        // The root redirect and these localized pages are prerendered.
        // Keep their trailing-slash variants in Proxy for the canonical redirect.
        "/((?!$|(?:es|en)(?:/(?:confirmacion-de-donacion|conoce-sigue|donacion|ecosistema|eventos|inicio-2026|politica-de-privacidad|recursos|sigue-academy|sigue-hub|sigue-tracks))?$|api/public/forms/novedades$|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|pdf|docx|mp4|webm)$).*)",
    ],
};
