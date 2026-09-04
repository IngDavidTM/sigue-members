import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  CalendarDays,
  Church,
  Factory,
  HandCoins,
  Handshake,
  Heart,
  MonitorPlay,
  Store,
} from 'lucide-react';
import Reveal from '@/app/components/ui/Reveal';
import { absoluteUrl } from '@/lib/site-url';
import styles from './HomeLanding.module.css';

type Locale = 'es' | 'en';

const content = {
  es: {
    skip: 'Saltar al contenido',
    slide: 'Desliza para ver más',
    hero: {
      eyebrow: 'SIGUE SCALE-UP FRAMEWORK™ — AUTOEVALUACIÓN —',
      title: 'Descubre dónde está tu organización.',
      accent: 'Transformamos comunidades fortaleciendo a quienes las sirven.',
      body: 'Nuestra herramienta diagnóstica evalúa tu organización en 5 ejes estratégicos para identificar oportunidades de fortalecimiento y conectarte con una ruta de crecimiento. Así podrás desarrollar las capacidades necesarias para fortalecer tu gestión, ampliar tu alcance y demostrar con evidencia el cambio que generas en las comunidades.',
      cta: 'Comienza tu autoevaluación gratuita',
      frameworkTitle: 'SIGUE Scale-Up™',
      frameworkSubtitle: 'Autoevaluación diagnóstica por ejes',
      axes: [
        ['S', 'SERVIR', 'Propósito claro y necesidades comprendidas'],
        ['I', 'IMPACTAR', 'Resultados medibles y transformación visible'],
        ['G', 'GUIAR', 'Liderazgo saludable y capacidad compartida'],
        ['U', 'UNIR FUERZAS', 'Alianzas estratégicas que multiplican impacto'],
        ['E', 'EQUIPAR PARA EXPANDIR', 'Gestión sólida, recursos diversos y sostenibilidad'],
      ],
      stats: [
        ['35+', 'Organizaciones miembros'],
        ['25', 'Organizaciones evaluadas'],
        ['5000+', 'Horas donadas'],
      ],
    },
    network: {
      label: 'NUESTRA RED',
      title: 'Comunidad y estrategia para un',
      accent: 'impacto sostenible',
      paragraphs: [
        'En SIGUE Network potenciamos y conectamos a organizaciones que enfrentan barreras como la falta de financiamiento, herramientas y visibilidad, fortaleciendo sus capacidades para crecer de manera sostenible.',
        'Te acompañamos con estrategias, mentoría experta, herramientas innovadoras y alianzas estratégicas que fortalecen tu misión y escalan tu impacto para lograr una transformación integral —física, emocional y espiritual— en las comunidades que sirves.',
      ],
      cta: 'Descubre cómo SIGUE te fortalece',
      imageAlt: 'Miembros de la red SIGUE reunidos en comunidad',
    },
    audience: {
      label: '¿PARA QUIÉN ES SIGUE?',
      titleStart: '¿Quién puede unirse a',
      titleBrand: 'SIGUE Network?',
      intro: 'Si lideras o haces parte de una iniciativa u organización de transformación social fundamentada en valores cristianos, aquí encontrarás el apoyo que necesitas.',
      cards: [
        ['Proyectos sociales', 'Convierte una buena idea en una iniciativa sólida, sostenible y preparada para crecer.'],
        ['Entidades sin ánimo de lucro', 'Fortalece tu organización para ser financiable, visible y capaz de demostrar con evidencia el cambio que genera.'],
        ['Empresas de impacto social', 'Impulsa un modelo de negocio que combine propósito, sostenibilidad financiera e impacto social.'],
        ['Equipos en iglesias y misiones', 'Fortalece tu ministerio para servir con mayor estrategia, movilizar recursos y ampliar su impacto en la comunidad.'],
      ],
      cta: 'Hazte miembro de SIGUE',
      galleryAlt: 'Participantes y miembros de SIGUE Network',
    },
    impact: {
      label: 'NUESTRO PRIMER AÑO',
      title: 'Impacto en',
      accent: 'números',
      intro: 'Todo esto ha sido posible gracias al compromiso de nuestros voluntarios, el poder de la oración y la generosidad de quienes creen que organizaciones fortalecidas y conectadas pueden transformar comunidades y generaciones.',
      stats: [
        ['56', 'Líderes en la 1ª Cumbre SIGUE'],
        ['35', 'Organizaciones se hicieron miembros'],
        ['25', 'Autoevaluadas con SIGUE Scale-Up™'],
        ['5000+', 'Horas donadas en acompañamiento'],
      ],
    },
    portfolio: {
      label: 'NUESTRO PORTAFOLIO',
      titleStart: '¿Cómo potenciamos + conectamos',
      titleAccent: 'tu organización?',
      intro: 'A través de un ecosistema que fortalece, forma, conecta y acelera organizaciones para ampliar su impacto y transformar más comunidades de forma integral.',
      cards: [
        {
          kicker: 'Fortalecimiento',
          logo: '/images/home-2026/sigue-consulting-transparent.png',
          logoAlt: 'SIGUE Consulting',
          question: '¿Está tu organización lista para dar el siguiente salto de impacto?',
          body: 'Acompañamiento estratégico para fortalecer organizaciones, ampliar su impacto y prepararlas para ser financiables, visibles y sostenibles.',
          cta: 'Pregúntanos',
          href: '/sigue-consulting',
        },
        {
          kicker: 'Formación',
          logo: '/images/home-2026/sigue-academy-transparent.png',
          logoAlt: 'SIGUE Academy',
          question: '¿Quieres fortalecer las capacidades de tu organización?',
          body: 'Programas de formación y certificación que fortalecen las capacidades de líderes y organizaciones para crecer, innovar y generar un impacto sostenible.',
          cta: 'Conoce más',
          href: '/sigue-academy',
        },
        {
          kicker: 'Conexión',
          logo: '/images/home-2026/sigue-hub-transparent.png',
          logoAlt: 'SIGUE Hub',
          question: '¿Quieres ampliar tu alcance y generar alianzas estratégicas?',
          body: 'Una red de recursos, herramientas, líderes y aliados que comparten los mismos valores e impulsan la colaboración, la visibilidad y nuevas oportunidades de impacto.',
          cta: 'Conéctate',
          href: '/sigue-hub',
        },
        {
          kicker: 'Aceleración',
          logo: '/images/home-2026/sigue-fellows-transparent.png',
          logoAlt: 'SIGUE Fellows',
          question: '¿Está tu organización preparada para multiplicar su impacto?',
          body: 'Programa intensivo de 18 semanas para organizaciones de alto potencial, con mentoría personalizada, formación especializada, trabajo aplicado y acceso a capital semilla.',
          cta: 'Pregúntanos',
          href: '/contacto',
        },
      ],
    },
    route: {
      label: 'TU RUTA DE CRECIMIENTO',
      title: 'Del diagnóstico',
      accent: 'a la acción',
      body: 'Tu ruta de crecimiento te acompaña a pasar del diagnóstico a la acción en tres pasos: A. Completa la autoevaluación SIGUE Scale-Up™, B. Conoce la fase de desarrollo de tu organización y C. Decide por dónde comenzar a fortalecer tu gestión, visibilidad e impacto integral.',
      steps: [
        ['A', 'Completa tu autoevaluación SIGUE Scale-Up™'],
        ['B', 'Conoce la fase de desarrollo de tu organización'],
        ['C', 'Decide dónde comenzar a fortalecer tu gestión, visibilidad e impacto'],
      ],
      cta: 'Completa tu autoevaluación gratuita',
      imageAlt: 'Acompañamiento estratégico entre miembros de SIGUE',
      storyLabel: 'TESTIMONIOS DE QUIENES YA DIERON ESTE PASO',
      storyOrg: 'FUNDACIÓN Misiones on Fire',
      storyImageAlt: 'Comunidad acompañada por la Fundación Misiones on Fire',
    },
    testimonials: {
      label: 'LO QUE DICEN NUESTROS MIEMBROS',
      items: [
        ['“SIGUE ha significado para Únicas una herramienta y un apoyo fundamental que nos impulsa a mantenernos firmes en la misma meta: trabajar juntas por un bien común.”', 'ÚNICAS ONG, Guatemala'],
        ['“SIGUE le dio forma a un sueño que solo existía en papel. Hoy tenemos claridad de nuestra misión, y eso ya se siente en la vida de las 50 familias con las que trabajamos.”', 'Fundación Ilumina, Caucasia, Colombia'],
        ['“Con SIGUE dejé de sentirme sola. Recibimos guía y acompañamiento real en un trabajo tan sensible como la prevención del abuso, y eso nos ha dado la claridad interna que necesitábamos.”', 'Fundación Misión Vallado, San Gil, Colombia'],
      ],
      cta: 'Conoce nuestros miembros',
    },
    connections: {
      label: 'ESPACIOS DE CONEXIÓN',
      titleStart: '¿Cómo',
      titleAccent: 'conectamos?',
      intro: 'Creamos espacios donde líderes y organizaciones pueden compartir experiencias, fortalecer alianzas y crecer juntos.',
      imageAlt: 'Equipo de SIGUE Network en un espacio de conexión',
      cards: [
        ['Comunidad Online', '¿Quieres conectarte con otros líderes y aprender juntos todo el año?', 'Un espacio exclusivo para compartir experiencias, acceder a recursos y crecer junto a una comunidad comprometida con la transformación integral.', 'Únete a la comunidad', '/miembros-sigue'],
        ['Eventos', '¿Quieres aprender, inspirarte, formar sinergias y ampliar tu red de contactos?', 'Webinars, talleres y cumbres para fortalecer capacidades, compartir buenas prácticas y generar nuevas oportunidades de colaboración.', 'Participa', '/eventos'],
        ['Red de expertos', '¿Necesitas apoyo especializado para fortalecer tu organización?', 'Acceso a profesionales que ofrecen servicios especializados para responder a necesidades clave de su gestión.', 'Conócelos', '/contacto'],
        ['Financiamiento', '¿Buscas recursos para impulsar o expandir tu misión?', 'Identificamos oportunidades de financiamiento y conectamos organizaciones elegibles con fundaciones, donantes y otras fuentes de apoyo.', 'Pregúntanos', '/contacto'],
      ],
    },
    events: {
      label: 'CALENDARIO',
      title: 'Próximos eventos y',
      accent: 'oportunidades',
      intro: 'Participa en nuestros webinars, talleres y cumbres diseñados para potenciar tu misión.',
      cta: 'Ver todos los eventos',
      cards: [
        ['Julio', '23', 'Webinar: Medición de Impacto', 'Aprende a evidenciar la transformación que tu organización genera.', 'Webinar gratuito', '/eventos'],
        ['Julio', '25', 'Taller: Gobernanza para ONGs', 'Estructura tu junta directiva y fortalece la sostenibilidad de tu organización.', 'Taller virtual', '/eventos'],
        ['Octubre 2026', '', '2ª Cumbre SIGUE 2026', 'El encuentro anual de líderes comprometidos con la transformación integral.', 'Evento presencial', '/cumbre-sigue-2026'],
      ],
    },
    newsletter: {
      label: 'CONÉCTATE CON NOSOTROS',
      title: 'Recibe recursos e inspiración',
      accent: 'para tu misión',
      body: 'Suscríbete para recibir herramientas, historias de impacto y oportunidades de conexión.',
      email: 'Tu correo electrónico',
      cta: 'Suscríbete',
    },
    final: {
      label: 'TU ORGANIZACIÓN PUEDE MÁS',
      title: 'Descubre tu potencial',
      accent: 'Escala tu impacto.',
      body: 'Completa la autoevaluación gratuita, conoce la fase de desarrollo de tu organización y decide dónde comenzar a fortalecer su gestión, visibilidad e impacto integral en las comunidades que sirve.',
      cta: 'Completa tu autoevaluación gratuita',
      imageAlt: 'Miembros del equipo SIGUE Network',
    },
    footer: {
      body: 'Potenciamos y conectamos ONGs, proyectos sociales y empresas basados en principios cristianos para transformar integralmente comunidades.',
      discover: 'DESCUBRE',
      participate: 'PARTICIPA',
      linksDiscover: [['Inicio', '#inicio'], ['Conoce SIGUE', '/conoce-sigue'], ['SIGUE Tracks', '/sigue-tracks'], ['Consulting', '/sigue-consulting'], ['SIGUE Hub', '/sigue-hub']],
      linksParticipate: [['Únete', '/miembros-sigue'], ['Contáctanos', '/contacto'], ['Donación', '/donacion'], ['Voluntariado', '/unete']],
      rights: '© 2026 SIGUE NETWORK. TODOS LOS DERECHOS RESERVADOS.',
    },
  },
  en: {
    skip: 'Skip to content',
    slide: 'Swipe to see more',
    hero: {
      eyebrow: 'SIGUE SCALE-UP FRAMEWORK™ — SELF-ASSESSMENT —',
      title: 'Discover where your organization stands.',
      accent: 'We transform communities by strengthening those who serve them.',
      body: 'Our diagnostic tool evaluates your organization across 5 strategic dimensions to identify opportunities for growth and connect you with a development path. Build the capabilities you need to strengthen management, expand your reach, and demonstrate the change you create in communities.',
      cta: 'Start your free self-assessment',
      frameworkTitle: 'SIGUE Scale-Up™',
      frameworkSubtitle: 'Diagnostic self-assessment by dimension',
      axes: [
        ['S', 'SERVE', 'Clear purpose and understood needs'],
        ['I', 'IMPACT', 'Measurable results and visible transformation'],
        ['G', 'GUIDE', 'Healthy leadership and shared capacity'],
        ['U', 'UNITE', 'Strategic alliances that multiply impact'],
        ['E', 'EQUIP TO EXPAND', 'Solid management, diverse resources, and sustainability'],
      ],
      stats: [['35+', 'Member organizations'], ['25', 'Organizations assessed'], ['5000+', 'Hours donated']],
    },
    network: {
      label: 'OUR NETWORK',
      title: 'Community and strategy for',
      accent: 'sustainable impact',
      paragraphs: [
        'At SIGUE Network, we strengthen and connect organizations that face barriers such as limited funding, tools, and visibility, building their capacity to grow sustainably.',
        'We walk alongside you with strategies, expert mentoring, innovative tools, and strategic alliances that strengthen your mission and scale your impact to achieve holistic —physical, emotional, and spiritual— transformation in the communities you serve.',
      ],
      cta: 'Discover how SIGUE strengthens you',
      imageAlt: 'SIGUE Network members gathered in community',
    },
    audience: {
      label: 'WHO IS SIGUE FOR?',
      titleStart: 'Who can join',
      titleBrand: 'SIGUE Network?',
      intro: 'If you lead or are part of a social transformation initiative or organization grounded in Christian values, you will find the support you need here.',
      cards: [
        ['Social projects', 'Turn a good idea into a solid, sustainable initiative prepared to grow.'],
        ['Nonprofit organizations', 'Strengthen your organization to become fundable, visible, and able to demonstrate its change with evidence.'],
        ['Social impact businesses', 'Advance a business model that combines purpose, financial sustainability, and social impact.'],
        ['Church and missions teams', 'Strengthen your ministry to serve more strategically, mobilize resources, and expand its community impact.'],
      ],
      cta: 'Become a SIGUE member',
      galleryAlt: 'SIGUE Network participants and members',
    },
    impact: {
      label: 'OUR FIRST YEAR',
      title: 'Impact in',
      accent: 'numbers',
      intro: 'This has been possible thanks to our volunteers’ commitment, the power of prayer, and the generosity of those who believe that strengthened, connected organizations can transform communities and generations.',
      stats: [['56', 'Leaders at the 1st SIGUE Summit'], ['35', 'Organizations became members'], ['25', 'Assessed with SIGUE Scale-Up™'], ['5000+', 'Hours of support donated']],
    },
    portfolio: {
      label: 'OUR PORTFOLIO',
      titleStart: 'How do we strengthen + connect',
      titleAccent: 'your organization?',
      intro: 'Through an ecosystem that strengthens, trains, connects, and accelerates organizations so they can expand their impact and transform more communities holistically.',
      cards: [
        { kicker: 'Strengthening', logo: '/images/home-2026/sigue-consulting-transparent.png', logoAlt: 'SIGUE Consulting', question: 'Is your organization ready for its next impact leap?', body: 'Strategic support to strengthen organizations, expand their impact, and prepare them to become fundable, visible, and sustainable.', cta: 'Ask us', href: '/sigue-consulting' },
        { kicker: 'Training', logo: '/images/home-2026/sigue-academy-transparent.png', logoAlt: 'SIGUE Academy', question: 'Do you want to strengthen your organization’s capabilities?', body: 'Training and certification programs that equip leaders and organizations to grow, innovate, and create sustainable impact.', cta: 'Learn more', href: '/sigue-academy' },
        { kicker: 'Connection', logo: '/images/home-2026/sigue-hub-transparent.png', logoAlt: 'SIGUE Hub', question: 'Do you want to expand your reach and build strategic alliances?', body: 'A network of resources, tools, leaders, and allies who share the same values and advance collaboration, visibility, and new impact opportunities.', cta: 'Connect', href: '/sigue-hub' },
        { kicker: 'Acceleration', logo: '/images/home-2026/sigue-fellows-transparent.png', logoAlt: 'SIGUE Fellows', question: 'Is your organization prepared to multiply its impact?', body: 'An intensive 18-week program for high-potential organizations, with personalized mentoring, specialized training, applied work, and access to seed capital.', cta: 'Ask us', href: '/contacto' },
      ],
    },
    route: {
      label: 'YOUR GROWTH PATH',
      title: 'From diagnosis',
      accent: 'to action',
      body: 'Your growth path guides you from diagnosis to action in three steps: A. Complete the SIGUE Scale-Up™ self-assessment, B. Learn your organization’s development stage, and C. Decide where to begin strengthening your management, visibility, and holistic impact.',
      steps: [['A', 'Complete your SIGUE Scale-Up™ self-assessment'], ['B', 'Learn your organization’s development stage'], ['C', 'Decide where to begin strengthening management, visibility, and impact']],
      cta: 'Complete your free self-assessment',
      imageAlt: 'Strategic support between SIGUE members',
      storyLabel: 'STORIES FROM THOSE WHO HAVE ALREADY TAKEN THIS STEP',
      storyOrg: 'Misiones on Fire Foundation',
      storyImageAlt: 'Community supported by the Misiones on Fire Foundation',
    },
    testimonials: {
      label: 'WHAT OUR MEMBERS SAY',
      items: [
        ['“SIGUE has given Únicas an essential tool and support that encourages us to remain firm in the same goal: working together for the common good.”', 'ÚNICAS NGO, Guatemala'],
        ['“SIGUE gave shape to a dream that only existed on paper. Today our mission is clear, and that is already visible in the lives of the 50 families we work with.”', 'Ilumina Foundation, Caucasia, Colombia'],
        ['“With SIGUE, I stopped feeling alone. We received real guidance and support in work as sensitive as abuse prevention, giving us the internal clarity we needed.”', 'Misión Vallado Foundation, San Gil, Colombia'],
      ],
      cta: 'Meet our members',
    },
    connections: {
      label: 'CONNECTION SPACES',
      titleStart: 'How do we',
      titleAccent: 'connect?',
      intro: 'We create spaces where leaders and organizations can share experiences, strengthen alliances, and grow together.',
      imageAlt: 'SIGUE Network team in a connection space',
      cards: [
        ['Online community', 'Would you like to connect with other leaders and learn together throughout the year?', 'An exclusive space to share experiences, access resources, and grow with a community committed to holistic transformation.', 'Join the community', '/miembros-sigue'],
        ['Events', 'Would you like to learn, find inspiration, build synergy, and expand your network?', 'Webinars, workshops, and summits to build capacity, share good practices, and create new opportunities for collaboration.', 'Take part', '/eventos'],
        ['Expert network', 'Do you need specialized support to strengthen your organization?', 'Access professionals who offer specialized services to address key management needs.', 'Meet them', '/contacto'],
        ['Funding', 'Are you looking for resources to advance or expand your mission?', 'We identify funding opportunities and connect eligible organizations with foundations, donors, and other sources of support.', 'Ask us', '/contacto'],
      ],
    },
    events: {
      label: 'CALENDAR',
      title: 'Upcoming events and',
      accent: 'opportunities',
      intro: 'Join our webinars, workshops, and summits designed to advance your mission.',
      cta: 'View all events',
      cards: [
        ['July', '23', 'Webinar: Impact Measurement', 'Learn how to demonstrate the transformation your organization creates.', 'Free webinar', '/eventos'],
        ['July', '25', 'Workshop: Governance for NGOs', 'Structure your board and strengthen your organization’s sustainability.', 'Virtual workshop', '/eventos'],
        ['October 2026', '', '2nd SIGUE Summit 2026', 'The annual gathering of leaders committed to holistic transformation.', 'In-person event', '/cumbre-sigue-2026'],
      ],
    },
    newsletter: {
      label: 'CONNECT WITH US',
      title: 'Receive resources and inspiration',
      accent: 'for your mission',
      body: 'Subscribe to receive tools, impact stories, and connection opportunities.',
      email: 'Your email address',
      cta: 'Subscribe',
    },
    final: {
      label: 'YOUR ORGANIZATION CAN DO MORE',
      title: 'Discover your potential',
      accent: 'Scale your impact.',
      body: 'Complete the free self-assessment, learn your organization’s development stage, and decide where to begin strengthening its management, visibility, and holistic impact in the communities it serves.',
      cta: 'Complete your free self-assessment',
      imageAlt: 'SIGUE Network team members',
    },
    footer: {
      body: 'We strengthen and connect NGOs, social projects, and businesses grounded in Christian principles to transform communities holistically.',
      discover: 'DISCOVER',
      participate: 'PARTICIPATE',
      linksDiscover: [['Home', '#inicio'], ['About SIGUE', '/conoce-sigue'], ['SIGUE Tracks', '/sigue-tracks'], ['Consulting', '/sigue-consulting'], ['SIGUE Hub', '/sigue-hub']],
      linksParticipate: [['Join', '/miembros-sigue'], ['Contact us', '/contacto'], ['Donate', '/donacion'], ['Volunteer', '/unete']],
      rights: '© 2026 SIGUE NETWORK. ALL RIGHTS RESERVED.',
    },
  },
} as const;

const audienceIcons = [Heart, Store, Factory, Church];
const connectionIcons = [MonitorPlay, CalendarDays, Handshake, HandCoins];

function localizedHref(locale: Locale, href: string) {
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return href;
  return `/${locale}${href}`;
}

function DecorativeBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`${styles.decorativeBlock} ${className}`} aria-hidden="true">
      <span />
    </div>
  );
}

function SectionHeading({
  label,
  title,
  accent,
  centered = true,
}: {
  label: string;
  title: string;
  accent?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? styles.headingCentered : styles.headingLeft}>
      <p className={styles.eyebrow}>{label}</p>
      <h2>
        {title} {accent && <em>{accent}</em>}
      </h2>
    </div>
  );
}

function PrimaryLink({ locale, href, children }: { locale: Locale; href: string; children: React.ReactNode }) {
  return (
    <Link className={styles.primaryButton} href={localizedHref(locale, href)}>
      {children}
    </Link>
  );
}

export default function HomeLanding({ locale }: { locale: Locale; preview?: boolean }) {
  const c = content[locale];
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'SIGUE Network',
    url: absoluteUrl(`/${locale}`),
    logo: absoluteUrl('/images/home-2026/logo-transparent.png'),
    email: 'info@siguenetwork.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3913 Griese Lane',
      addressLocality: 'Grovetown',
      addressRegion: 'GA',
      postalCode: '30813',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.instagram.com/siguenetwork/',
      'https://www.facebook.com/people/SIGUE-Network/61566310019607/',
      'https://www.linkedin.com/company/sigue-network/',
      'https://www.youtube.com/@SIGUENetwork',
    ],
  };

  return (
    <div data-home-2026 id="inicio" className={styles.page}>
      <a className={styles.skipLink} href="#contenido-principal">{c.skip}</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />

      <main id="contenido-principal">
        <section className={styles.hero} aria-labelledby="home-hero-title">
          <div className={styles.heroInner}>
            <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>{c.hero.eyebrow}</p>
            <Reveal className={styles.heroCopy} variant="slide-left" amount={0.1}>
              <h1 id="home-hero-title">{c.hero.title}</h1>
              <p className={styles.heroAccent}>{c.hero.accent}</p>
              <p className={styles.heroBody}>{c.hero.body}</p>
              <PrimaryLink locale={locale} href="/sigue-tracks">{c.hero.cta}</PrimaryLink>
              <div className={styles.heroStats}>
                {c.hero.stats.map(([value, label]) => (
                  <div key={label}><strong>{value}</strong><span>{label}</span></div>
                ))}
              </div>
            </Reveal>
            <Reveal className={styles.framework} variant="slide-right" amount={0.1} delay={0.12}>
              <div className={styles.frameworkTitle}>
                <Activity aria-hidden="true" />
                <div><strong>{c.hero.frameworkTitle}</strong><span>{c.hero.frameworkSubtitle}</span></div>
              </div>
              <div className={styles.axesGrid}>
                {c.hero.axes.map(([letter, title, description], index) => (
                  <div className={styles.axisCard} data-axis={index + 1} key={letter}>
                    <span>{letter}</span><strong>{title}</strong><small>{description}</small>
                  </div>
                ))}
              </div>
              <PrimaryLink locale={locale} href="/sigue-tracks">{c.hero.cta}</PrimaryLink>
            </Reveal>
          </div>
        </section>

        <section id="nuestra-red" className={styles.networkSection} aria-labelledby="network-title">
          <div className={styles.networkImage}>
            <Image src="/images/home-2026/network.webp" alt={c.network.imageAlt} fill sizes="100vw" priority={false} />
            <span className={styles.photoAccent} aria-hidden="true" />
          </div>
          <div className={styles.networkBody}>
            <p className={styles.eyebrow}>{c.network.label}</p>
            <Reveal className={styles.networkCard} variant="fade-up">
              <h2 id="network-title">{c.network.title} <em>{c.network.accent}</em></h2>
              {c.network.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </Reveal>
            <PrimaryLink locale={locale} href="/conoce-sigue">{c.network.cta}</PrimaryLink>
          </div>
        </section>

        <section id="para-quien" className={styles.audienceSection} aria-labelledby="audience-title">
          <div className={styles.container}>
            <SectionHeading label={c.audience.label} title={c.audience.titleStart} accent={c.audience.titleBrand} />
            <p className={styles.sectionIntro}>{c.audience.intro}</p>
            <p className={styles.mobileScrollHint}>{c.slide} →</p>
            <div className={styles.cardRail}>
              {c.audience.cards.map(([title, description], index) => {
                const Icon = audienceIcons[index];
                return (
                  <Reveal className={styles.audienceCard} key={title} delay={index * 0.06}>
                    <div className={styles.iconFrame}><Icon aria-hidden="true" /></div>
                    <h3>{title}</h3><p>{description}</p>
                  </Reveal>
                );
              })}
            </div>
            <div className={styles.centeredButton}><PrimaryLink locale={locale} href="/miembros-sigue">{c.audience.cta}</PrimaryLink></div>
          </div>
          <div className={styles.communityGallery} aria-label={c.audience.galleryAlt}>
            {['community-1.webp', 'community-2.webp', 'community-3.webp'].map((file) => (
              <div key={file}><Image src={`/images/home-2026/${file}`} alt="" fill sizes="33vw" className={styles.coverImage} /></div>
            ))}
          </div>
          <div id="impacto" className={styles.impactBand}>
            <Reveal>
              <SectionHeading label={c.impact.label} title={c.impact.title} accent={c.impact.accent} />
              <p>{c.impact.intro}</p>
              <div className={styles.impactStats}>
                {c.impact.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="portafolio" className={styles.portfolioSection} aria-labelledby="portfolio-title">
          <span className={styles.portfolioAccent} aria-hidden="true" />
          <div className={styles.container}>
            <div className={styles.headingCentered}>
              <p className={styles.eyebrow}>{c.portfolio.label}</p>
              <h2 id="portfolio-title">{c.portfolio.titleStart} <em>{c.portfolio.titleAccent}</em></h2>
            </div>
            <p className={styles.sectionIntro}>{c.portfolio.intro}</p>
            <p className={styles.mobileScrollHint}>{c.slide} →</p>
            <div className={`${styles.cardRail} ${styles.portfolioRail}`}>
              {c.portfolio.cards.map((card, index) => (
                <Reveal className={styles.portfolioCard} key={card.logoAlt} delay={index * 0.06}>
                  <span className={styles.cardKicker}>{card.kicker}</span>
                  <div className={styles.portfolioLogo}>
                    <Image src={card.logo} alt={card.logoAlt} fill sizes="220px" className={styles.containImage} />
                  </div>
                  <h3>{card.question}</h3><p>{card.body}</p>
                  <Link href={localizedHref(locale, card.href)}>{card.cta}</Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="ruta-crecimiento" className={styles.routeSection} aria-labelledby="route-title">
          <div className={styles.routeTop}>
            <div className={styles.routeVisual}>
              <DecorativeBlock />
              <div className={styles.routeImage}><Image src="/images/home-2026/growth-route.webp" alt={c.route.imageAlt} fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.coverImage} /></div>
            </div>
            <Reveal className={styles.routeCopy} variant="slide-right">
              <SectionHeading label={c.route.label} title={c.route.title} accent={c.route.accent} centered={false} />
              <p>{c.route.body}</p>
            </Reveal>
          </div>
          <div className={styles.stepsBand}>
            <div className={styles.steps}>
              {c.route.steps.map(([letter, title]) => <div key={letter}><strong>{letter}</strong><span>{title}</span></div>)}
            </div>
            <PrimaryLink locale={locale} href="/sigue-tracks">{c.route.cta}</PrimaryLink>
          </div>
          <div className={styles.storyBand}>
            <Reveal className={styles.storyImage} variant="slide-left"><Image src="/images/home-2026/misiones.webp" alt={c.route.storyImageAlt} fill sizes="(max-width: 780px) 100vw, 45vw" className={styles.coverImage} /></Reveal>
            <Reveal className={styles.storyCopy} variant="slide-right">
              <p className={styles.storyLabel}>{c.route.storyLabel}</p>
              <div className={styles.storyLogo}><Image src="/images/home-2026/misiones-on-fire-transparent.png" alt="Misiones on Fire" fill sizes="260px" className={styles.containImage} /></div>
              <strong>{c.route.storyOrg}</strong>
              <PrimaryLink locale={locale} href="/sigue-tracks">{c.route.cta}</PrimaryLink>
            </Reveal>
          </div>
        </section>

        <section id="testimonios" className={styles.testimonialsSection} aria-labelledby="testimonials-title">
          <div className={styles.container}>
            <p id="testimonials-title" className={`${styles.eyebrow} ${styles.centerText}`}>{c.testimonials.label}</p>
            <p className={styles.mobileScrollHint}>{c.slide} →</p>
            <div className={`${styles.cardRail} ${styles.testimonialRail}`}>
              {c.testimonials.items.map(([quote, organization], index) => (
                <Reveal className={styles.testimonial} key={organization} delay={index * 0.08}>
                  <span aria-hidden="true">“</span><blockquote>{quote}</blockquote><cite>{organization}</cite>
                </Reveal>
              ))}
            </div>
            <div className={styles.centeredButton}><PrimaryLink locale={locale} href="/miembros-sigue">{c.testimonials.cta}</PrimaryLink></div>
          </div>
        </section>

        <section id="conexion" className={styles.connectionsSection} aria-labelledby="connections-title">
          <div className={styles.connectionsImage}><Image src="/images/home-2026/connections.webp" alt={c.connections.imageAlt} fill sizes="100vw" className={styles.coverImage} /></div>
          <div className={styles.container}>
            <div className={styles.headingCentered}>
              <p className={styles.eyebrow}>{c.connections.label}</p>
              <h2 id="connections-title">{c.connections.titleStart} <em>{c.connections.titleAccent}</em></h2>
            </div>
            <p className={styles.sectionIntro}>{c.connections.intro}</p>
            <p className={styles.mobileScrollHint}>{c.slide} →</p>
            <div className={styles.cardRail}>
              {c.connections.cards.map(([title, question, body, cta, href], index) => {
                const Icon = connectionIcons[index];
                return (
                  <Reveal className={styles.connectionCard} key={title} delay={index * 0.06}>
                    <div className={styles.iconFrame}><Icon aria-hidden="true" /></div>
                    <h3>{title}</h3><em>{question}</em><p>{body}</p>
                    <Link href={localizedHref(locale, href)}>{cta}</Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="eventos" className={styles.eventsSection} aria-labelledby="events-title">
          <div className={styles.eventsHeading}>
            <DecorativeBlock />
            <div>
              <SectionHeading label={c.events.label} title={c.events.title} accent={c.events.accent} centered={false} />
              <p>{c.events.intro}</p>
              <PrimaryLink locale={locale} href="/eventos">{c.events.cta}</PrimaryLink>
            </div>
          </div>
          <div className={styles.eventsBand}>
            <p className={styles.mobileScrollHint}>{c.slide} →</p>
            <div className={`${styles.cardRail} ${styles.eventsRail}`}>
              {c.events.cards.map(([month, day, title, body, tag, href], index) => (
                <Reveal className={styles.eventCard} key={title} delay={index * 0.08}>
                  <div className={styles.eventDate}><span>{month}</span>{day && <strong>{day}</strong>}</div>
                  <div><h3>{title}</h3><p>{body}</p><Link href={localizedHref(locale, href)}>{tag}</Link></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="conectate" className={styles.newsletterSection} aria-labelledby="newsletter-title">
          <DecorativeBlock />
          <Reveal className={styles.newsletterCopy} variant="slide-right">
            <SectionHeading label={c.newsletter.label} title={c.newsletter.title} accent={c.newsletter.accent} centered={false} />
            <p>{c.newsletter.body}</p>
            <form action={`/${locale}/contacto`} method="get" className={styles.newsletterForm}>
              <label htmlFor={`newsletter-${locale}`} className={styles.srOnly}>{c.newsletter.email}</label>
              <input id={`newsletter-${locale}`} name="email" type="email" autoComplete="email" required placeholder={c.newsletter.email} />
              <button type="submit">{c.newsletter.cta}</button>
            </form>
          </Reveal>
        </section>

        <section id="potencial" className={styles.finalSection} aria-labelledby="final-title">
          <div className={styles.finalImage}><Image src="/images/home-2026/final-cta.webp" alt={c.final.imageAlt} fill sizes="100vw" className={styles.coverImage} /></div>
          <div className={styles.finalBody}>
            <DecorativeBlock />
            <Reveal className={styles.finalCopy} variant="slide-right">
              <SectionHeading label={c.final.label} title={c.final.title} accent={c.final.accent} centered={false} />
              <p>{c.final.body}</p>
              <PrimaryLink locale={locale} href="/sigue-tracks">{c.final.cta}</PrimaryLink>
            </Reveal>
          </div>
        </section>
      </main>

    </div>
  );
}
