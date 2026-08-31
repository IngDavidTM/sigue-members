import Image from 'next/image';
import Link from 'next/link';
import styles from './ResourcesLanding.module.css';

type Locale = 'es' | 'en';

const HERO_IMAGE = 'https://siguenetwork.org/wp-content/uploads/2024/11/recursos_sigue_network_banner.jpg';

const content = {
  es: {
    hero: {
      eyebrow: 'RECURSOS',
      title: 'Recursos SIGUE Network: herramientas y conexiones para potenciar tu impacto',
      description: 'Accede a estrategias, mentoría y una comunidad comprometida en apoyar tu misión de transformación integral.',
      alt: 'Persona conectándose por videollamada con líderes de SIGUE Network',
    },
    intro: 'Recursos para fortalecer tu organización y ampliar su impacto.',
    items: [
      {
        title: 'Herramientas y guías descargables para tu proyecto social u organización',
        question: '¿Estás enfrentando desafíos para ser financiable y encontrable?',
        body: 'Te ofrecemos recursos para evaluar qué tan financiable y visible es tu proyecto, ayudándote a identificar áreas clave para fortalecer tu organización.',
        cta: 'Descárgalos aquí',
        href: '/herramientas-y-guias',
      },
      {
        title: 'Webinars y talleres para fortalecer tus proyectos sociales',
        question: '¿Cómo establecer tu estrategia FES, a la vez que incrementas tu FE?',
        body: 'En nuestros encuentros aprenderás a crear tu plan FES e identificar áreas clave para ser más financiable y encontrable, aumentando tu acceso a financiamiento y expandiendo tu impacto.',
        cta: 'Inscríbete aquí',
        href: '/eventos',
      },
      {
        title: 'Comunidad online para líderes de proyectos de impacto físico, emocional y espiritual',
        question: '¿Cómo conectar, compartir experiencias y crecer en propósito mientras construyes alianzas que transforman comunidades?',
        body: 'Únete a nuestra comunidad online para sesiones de preguntas y respuestas, donde compartimos desafíos, aprendemos juntos y fortalecemos nuestra misión en oración.',
        cta: 'Únete aquí',
        href: '/miembros-sigue',
      },
    ],
  },
  en: {
    hero: {
      eyebrow: 'RESOURCES',
      title: 'SIGUE Network resources: tools and connections to strengthen your impact',
      description: 'Access strategies, mentoring, and a committed community ready to support your mission of holistic transformation.',
      alt: 'A person connecting by video call with SIGUE Network leaders',
    },
    intro: 'Resources to strengthen your organization and expand its impact.',
    items: [
      {
        title: 'Downloadable tools and guides for your social project or organization',
        question: 'Are you facing challenges becoming fundable and visible?',
        body: 'We offer resources to assess how fundable and visible your project is, helping you identify key areas where your organization can grow stronger.',
        cta: 'Download here',
        href: '/herramientas-y-guias',
      },
      {
        title: 'Webinars and workshops to strengthen your social projects',
        question: 'How can you build your FES strategy while increasing your FE?',
        body: 'In our sessions, you will learn to create your FES plan and identify key areas for becoming more fundable and visible, increasing access to funding and expanding your impact.',
        cta: 'Register here',
        href: '/eventos',
      },
      {
        title: 'Online community for leaders of projects with physical, emotional, and spiritual impact',
        question: 'How can you connect, share experiences, and grow in purpose while building partnerships that transform communities?',
        body: 'Join our online community for Q&A sessions where we share challenges, learn together, and strengthen our mission through prayer.',
        cta: 'Join here',
        href: '/miembros-sigue',
      },
    ],
  },
} as const;

function ResourceLink({ href, locale, children }: { href: string; locale: Locale; children: React.ReactNode }) {
  const className = styles.button;

  if (href.startsWith('http')) {
    return <a className={className} href={href}>{children}</a>;
  }

  return <Link className={className} href={`/${locale}${href}`}>{children}</Link>;
}

export default function ResourcesLanding({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <div className={styles.page} data-resources-page>
      <section className={styles.hero} aria-labelledby="resources-title">
        <Image
          src={HERO_IMAGE}
          alt={c.hero.alt}
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroComposition}>
          <span className={styles.eyebrow}>{c.hero.eyebrow}</span>
          <div className={styles.heroCopy}>
            <h1 id="resources-title">{c.hero.title}</h1>
            <p>{c.hero.description}</p>
          </div>
        </div>
      </section>

      <section className={styles.resources} aria-labelledby="resources-intro">
        <h2 id="resources-intro" className={styles.srOnly}>{c.intro}</h2>
        <div className={styles.grid}>
          {c.items.map((item, index) => (
            <article className={styles.card} key={item.title}>
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <h3>{item.title}</h3>
              <strong>{item.question}</strong>
              <p>{item.body}</p>
              <ResourceLink href={item.href} locale={locale}>{item.cta}</ResourceLink>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
