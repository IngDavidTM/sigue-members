import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CumbreLanding from '@/app/components/cumbre-2026/CumbreLanding';
import { absoluteUrl, getSiteUrl } from '@/lib/site-url';

type CumbreLocale = 'es' | 'en';
type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const content = {
  es: {
    title: 'Cumbre SIGUE Network 2026 | Bogotá',
    description:
      'Participa en la Cumbre SIGUE Network 2026 del 27 al 29 de octubre en Bogotá: liderazgo, fe, conexiones y herramientas para transformar comunidades.',
    eventName: '2.ª Cumbre SIGUE Network 2026',
    imageAlt: 'Comunidad SIGUE Network reunida en la Cumbre',
    keywords: [
      'Cumbre SIGUE Network 2026',
      'evento de liderazgo cristiano',
      'organizaciones sociales en Latinoamérica',
      'transformación comunitaria',
      'networking con propósito',
      'evento cristiano en Bogotá',
    ],
    audience:
      'Líderes cristianos, organizaciones sociales, iglesias, fundaciones, donantes y empresas con propósito',
    faqs: [
      [
        '¿Tengo que ser miembro de SIGUE para participar?',
        'No. Pero te invitamos a hacerte miembro y disfrutar de los beneficios de membresía.',
      ],
      [
        '¿El hospedaje es obligatorio?',
        'No. Pero hemos logrado una tarifa muy favorable para los participantes en el sitio del evento.',
      ],
      [
        '¿Cuántas noches y qué está incluido en el hospedaje?',
        'Incluye el hospedaje del 27 y 28 de octubre y los desayunos del 28 y 29 de octubre.',
      ],
      [
        '¿Las cenas, almuerzos y refrigerios están incluidas?',
        'Sí, los refrigerios, almuerzos y cenas del 27 y 28 están incluidos en la inscripción a la Cumbre.',
      ],
      ['¿Cuándo comienza y termina la Cumbre?', 'Del 27 en la tarde al 29 antes de la cena.'],
      [
        '¿Puedo transferir mi inscripción?',
        'Sí, puedes transferir tu cupo a otra persona hasta 7 días antes del evento escribiéndonos a info@siguenetwork.org.',
      ],
      [
        '¿Cuál es la política de reembolso?',
        'Reembolso del 80% hasta 30 días antes del evento, 50% entre 30 y 15 días antes, y sin reembolso a partir de los 14 días previos a la Cumbre. En todos los casos puedes optar por transferir tu cupo en lugar de solicitar reembolso.',
      ],
    ],
  },
  en: {
    title: 'SIGUE Network Summit 2026 | Bogotá',
    description:
      'Join the SIGUE Network Summit 2026, October 27–29 in Bogotá: leadership, faith, connections, and practical tools to transform communities.',
    eventName: '2nd SIGUE Network Summit 2026',
    imageAlt: 'SIGUE Network community gathered at the Summit',
    keywords: [
      'SIGUE Network Summit 2026',
      'Christian leadership event',
      'Latin American social organizations',
      'community transformation',
      'purpose-driven networking',
      'Christian event in Bogotá',
    ],
    audience:
      'Christian leaders, social organizations, churches, foundations, donors, and purpose-driven companies',
    faqs: [
      [
        'Do I have to be a SIGUE member to attend?',
        'No. However, we invite you to become a member and enjoy membership benefits.',
      ],
      [
        'Is lodging required?',
        'No. However, we have secured a very favorable rate for participants at the event venue.',
      ],
      [
        'How many nights are included and what does lodging include?',
        'It includes lodging on October 27 and 28, plus breakfast on October 28 and 29.',
      ],
      [
        'Are dinners, lunches, and refreshments included?',
        'Yes. Refreshments, lunches, and dinners on October 27 and 28 are included with Summit registration.',
      ],
      [
        'When does the Summit start and end?',
        'From the afternoon of October 27 until before dinner on October 29.',
      ],
      [
        'Can I transfer my registration?',
        'Yes. You can transfer your spot to another person up to 7 days before the event by writing to info@siguenetwork.org.',
      ],
      [
        'What is the refund policy?',
        'An 80% refund is available up to 30 days before the event, 50% between 30 and 15 days before, and no refund from 14 days before the Summit. In every case, you may transfer your spot instead of requesting a refund.',
      ],
    ],
  },
} as const;

function normalizeLocale(locale: string): CumbreLocale {
  return locale === 'en' ? 'en' : 'es';
}

function getPageUrl(locale: CumbreLocale) {
  return absoluteUrl(`/${locale}/cumbre-sigue-2026`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = normalizeLocale(requestedLocale);
  const copy = content[locale];
  const canonical = getPageUrl(locale);
  const image = absoluteUrl('/images/cumbre-2026/hero.webp');

  return {
    title: copy.title,
    description: copy.description,
    keywords: [...copy.keywords],
    authors: [{ name: 'SIGUE Network', url: getSiteUrl() }],
    creator: 'SIGUE Network',
    publisher: 'SIGUE Network',
    category: 'Leadership and community development',
    alternates: {
      canonical,
      languages: {
        'es-CO': getPageUrl('es'),
        'en-US': getPageUrl('en'),
        'x-default': getPageUrl('es'),
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: copy.title,
      description: copy.description,
      siteName: 'SIGUE Network',
      locale: locale === 'es' ? 'es_CO' : 'en_US',
      alternateLocale: locale === 'es' ? ['en_US'] : ['es_CO'],
      images: [{ url: image, width: 3072, height: 1728, alt: copy.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      'geo.region': 'CO-DC',
      'geo.placename': 'Bogotá',
      'geo.position': '4.7110;-74.0721',
      ICBM: '4.7110, -74.0721',
    },
  };
}

function getStructuredData(locale: CumbreLocale) {
  const copy = content[locale];
  const pageUrl = getPageUrl(locale);
  const siteUrl = getSiteUrl();
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${pageUrl}#webpage`;
  const eventId = `${getPageUrl('es')}#event`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'SIGUE Network',
        url: siteUrl,
        logo: absoluteUrl('/images/cumbre-2026/logo-sigue.png'),
        email: 'contacto@siguenetwork.org',
        sameAs: [
          'https://www.linkedin.com/company/sigue-network/',
          'https://www.instagram.com/siguenetwork/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: 'SIGUE Network',
        publisher: { '@id': organizationId },
        inLanguage: ['es-CO', 'en-US'],
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: pageUrl,
        name: copy.title,
        description: copy.description,
        inLanguage: locale === 'es' ? 'es-CO' : 'en-US',
        isPartOf: { '@id': websiteId },
        about: { '@id': eventId },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl('/images/cumbre-2026/hero.webp'),
          width: 3072,
          height: 1728,
        },
      },
      {
        '@type': 'Event',
        '@id': eventId,
        name: copy.eventName,
        description: copy.description,
        url: pageUrl,
        mainEntityOfPage: { '@id': webpageId },
        image: [absoluteUrl('/images/cumbre-2026/hero.webp')],
        startDate: '2026-10-27',
        endDate: '2026-10-29',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        inLanguage: locale === 'es' ? 'es-CO' : 'en-US',
        organizer: { '@id': organizationId },
        audience: {
          '@type': 'Audience',
          audienceType: copy.audience,
        },
        location: {
          '@type': 'Place',
          name: 'CELAM',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Carrera 72 #169',
            addressLocality: 'Bogotá',
            addressRegion: 'Distrito Capital',
            addressCountry: 'CO',
          },
        },
        offers: [
          {
            '@type': 'Offer',
            name: locale === 'es' ? 'Tarifa General' : 'General Rate',
            price: '599000',
            priceCurrency: 'COP',
            availability: 'https://schema.org/InStock',
            url: `${pageUrl}#inscripcion`,
          },
          {
            '@type': 'Offer',
            name: 'Early Bird',
            price: '489000',
            priceCurrency: 'COP',
            availability: 'https://schema.org/LimitedAvailability',
            url: `${pageUrl}#inscripcion`,
          },
          {
            '@type': 'Offer',
            name: locale === 'es' ? 'Miembro Activo SIGUE' : 'Active SIGUE Member',
            price: '449000',
            priceCurrency: 'COP',
            availability: 'https://schema.org/InStock',
            url: `${pageUrl}#inscripcion`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        url: `${pageUrl}#faq`,
        inLanguage: locale === 'es' ? 'es-CO' : 'en-US',
        mainEntity: copy.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      },
    ],
  };
}

export default async function CumbreSigue2026Page({ params }: PageProps) {
  const { locale: requestedLocale } = await params;

  if (requestedLocale !== 'es' && requestedLocale !== 'en') {
    redirect('/es/cumbre-sigue-2026');
  }

  const locale = requestedLocale as CumbreLocale;
  const structuredData = JSON.stringify(getStructuredData(locale)).replace(/</g, '\\u003c');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <CumbreLanding locale={locale} />
    </>
  );
}
