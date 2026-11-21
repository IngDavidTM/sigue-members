import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

/**
 * Plain-language summary of the site for AI assistants (llmstxt.org).
 * Keep it factual and in step with the pages it links to.
 */
export function GET() {
  const link = (label: string, path: string, note: string) => `- [${label}](${absoluteUrl(path)}): ${note}`;
  const body = `# SIGUE Network

> SIGUE Network is a nonprofit network that connects, equips, and strengthens purpose-driven organizations — NGOs, social projects, social-impact businesses, and church and missions teams — so they can scale sustainable, holistic impact. Founded by Sandra Prieto. The site is published in Spanish (/es) and English (/en).

SIGUE Network conecta, equipa y fortalece organizaciones con propósito para que escalen un impacto integral y sostenible.

Contact: info@siguenetwork.org

## What SIGUE offers

${[
    link("SIGUE Consulting", "/en/sigue-consulting", "strategic consulting for NGOs, social projects, businesses, and Christian associations."),
    link("SIGUE Academy", "/en/sigue-academy", "training and certification to help nonprofits and social projects measure, strengthen, and expand their impact."),
    link("SIGUE Tracks", "/en/sigue-tracks", "flexible routes that combine consulting, training, and connections."),
    link("SIGUE Hub", "/en/sigue-hub", "events, membership, training, tools, and connections for leaders and organizations."),
    link("Membership", "/en/miembros-sigue", "a network of leaders and organizations with resources, training, and strategic connections."),
    link("Ecosystem overview", "/en/ecosistema", "how training, community, consulting, acceleration, and diagnosis fit together."),
  ].join("\n")}

## Free resources

${[
    link("Tools library", "/en/herramientas", "free downloadable templates for nonprofits: population profile, impact one-pager, governance kit, partnership proposal, leader self-assessment, pilot design, core message, and 30-day communication plan."),
    link("Blog", "/en/blog", "articles on nonprofit strategy, governance, impact measurement, partnerships, leadership care, and communication."),
    link("Events", "/en/eventos", "workshops, online community sessions, and the annual SIGUE Summit."),
  ].join("\n")}

## About and contact

${[
    link("About SIGUE Network", "/en/conoce-sigue", "mission, approach, and team."),
    link("Get involved", "/en/unete", "volunteering, prayer, donations, and strategic support."),
    link("Donate", "/en/donacion", "support the network."),
    link("Contact", "/en/contacto", "contact form and channels."),
  ].join("\n")}

## En español

${[
    link("Inicio", "/es", "portada en español."),
    link("Conoce SIGUE", "/es/conoce-sigue", "misión, enfoque y equipo."),
    link("SIGUE Consulting", "/es/sigue-consulting", "consultoría estratégica para ONGs, proyectos sociales, empresas y asociaciones cristianas."),
    link("SIGUE Academy", "/es/sigue-academy", "formación y certificación para organizaciones y proyectos sociales."),
    link("Herramientas gratuitas", "/es/herramientas", "plantillas descargables para organizaciones sociales."),
    link("Blog", "/es/blog", "artículos para líderes y organizaciones que transforman comunidades."),
    link("Contacto", "/es/contacto", "formulario y canales de contacto."),
  ].join("\n")}

## Machine-readable

${[
    link("Sitemap", "/sitemap.xml", "every public URL with its Spanish and English versions."),
    link("Blog feed (English)", "/en/feed.xml", "RSS of the latest articles."),
    link("Blog feed (Spanish)", "/es/feed.xml", "RSS de los artículos más recientes."),
  ].join("\n")}
`;

  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
