import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  Gauge,
  GraduationCap,
  HandHeart,
  Heart,
  HelpCircle,
  Mail,
  Network,
} from 'lucide-react';
import styles from './EcosystemLanding.module.css';

type Locale = 'es' | 'en';
type LocalizedText = readonly [string, string];

const serviceCards = [
  {
    kicker: ['Acompañamiento', 'Guidance'] as LocalizedText,
    logo: '/images/home-2026/sigue-consulting-transparent.png',
    alt: 'SIGUE Consulting',
    question: ['¿Necesitas acompañamiento especializado para fortalecer un área de tu organización?', 'Do you need specialized guidance to strengthen an area of your organization?'] as LocalizedText,
    body: ['Acompañamiento estratégico para fortalecer organizaciones, ampliar su impacto y prepararlas para ser financiables, visibles y sostenibles.', 'Strategic guidance to strengthen organizations, expand their impact, and prepare them to become fundable, visible, and sustainable.'] as LocalizedText,
    cta: ['Conoce SIGUE Consulting™', 'Explore SIGUE Consulting™'] as LocalizedText,
    href: '/sigue-consulting',
  },
  {
    kicker: ['Formación', 'Training'] as LocalizedText,
    logo: '/images/home-2026/sigue-academy-transparent.png',
    alt: 'SIGUE Academy',
    question: ['¿Quieres fortalecer las capacidades de tu organización?', 'Do you want to strengthen your organization’s capabilities?'] as LocalizedText,
    body: ['Programas de formación y certificación que fortalecen las capacidades de líderes y organizaciones para crecer, innovar y generar un impacto sostenible.', 'Training and certification programs that equip leaders and organizations to grow, innovate, and create sustainable impact.'] as LocalizedText,
    cta: ['Conoce SIGUE Academy™', 'Explore SIGUE Academy™'] as LocalizedText,
    href: '/sigue-academy',
  },
  {
    kicker: ['Conexión', 'Connection'] as LocalizedText,
    logo: '/images/home-2026/sigue-hub-transparent.png',
    alt: 'SIGUE Hub',
    question: ['¿Quieres ampliar tu alcance y generar alianzas estratégicas?', 'Do you want to expand your reach and build strategic alliances?'] as LocalizedText,
    body: ['Una red de recursos, herramientas, líderes y aliados que comparten los mismos valores e impulsan la colaboración, la visibilidad y nuevas oportunidades de impacto.', 'A network of resources, tools, leaders, and allies who share the same values and advance collaboration, visibility, and new impact opportunities.'] as LocalizedText,
    cta: ['Conoce SIGUE Hub™', 'Explore SIGUE Hub™'] as LocalizedText,
    href: '/sigue-hub',
  },
  {
    kicker: ['Aceleración', 'Acceleration'] as LocalizedText,
    logo: '/images/home-2026/sigue-fellows-transparent.png',
    alt: 'SIGUE Fellows',
    question: ['¿Está tu organización preparada para multiplicar su impacto?', 'Is your organization ready to multiply its impact?'] as LocalizedText,
    body: ['Programa intensivo de 18 semanas para organizaciones de alto potencial, con mentoría personalizada, formación especializada, trabajo aplicado y acceso a capital semilla.', 'An intensive 18-week program for high-potential organizations, with personalized mentoring, specialized training, applied work, and access to seed capital.'] as LocalizedText,
    cta: ['Conoce SIGUE Fellows™', 'Explore SIGUE Fellows™'] as LocalizedText,
    href: '/contacto',
  },
] as const;

const content = {
  es: {
    skip: 'Saltar al contenido',
    hero: {
      label: 'NUESTRO ECOSISTEMA',
      title: 'Diferentes formas de',
      accent: 'ayudarte a crecer y conectar',
      body: 'Formación, comunidad, aceleración y acompañamiento especializado que puedes combinar de acuerdo con las necesidades y capacidades de tu organización, con herramientas prácticas, estrategias innovadoras y asesoría experta.',
      cta: 'Explora tus opciones',
      identity: ['fortalecer', '+', 'conectar'],
    },
    impactIntro: {
      label: 'POR QUÉ IMPORTA',
      title: 'Cuando una organización se fortalece y se conecta',
      accent: 'su impacto puede llegar más lejos',
      body: 'Por eso, en SIGUE fortalecemos y conectamos a quienes sirven para que puedan responder con mayor capacidad a las necesidades de sus comunidades, llegar más lejos y ampliar su impacto en lo físico, emocional y espiritual.',
      cta: 'Conoce el ecosistema SIGUE',
      alt: 'Una voluntaria compartiendo con familias de una comunidad',
    },
    consulting: {
      label: 'ACOMPAÑAMIENTO',
      tagline: 'Acompañamiento especializado para desafíos específicos',
      body: 'Ponemos nuestra experiencia en el sector nonprofit, herramientas prácticas e innovadoras y asesoría especializada al servicio de los desafíos concretos de tu organización.',
      bullets: [
        '¿Tus programas necesitan fortalecerse para responder mejor y crecer o parece que están estancados?',
        '¿Necesitas medir y comunicar mejor tu impacto?',
        '¿Necesitas fortalecer liderazgo, juntas directivas, equipos o voluntariado?',
        '¿Necesitas más visibilidad, conexiones o alianzas?',
        '¿Necesitas fortalecer tu estrategia y acceder a financiamiento?',
      ],
      cta: 'Hablemos de tu desafío',
      statsTitle: 'Nuestro acompañamiento en números',
      stats: [['6', 'Consultorías realizadas'], ['23', 'Mentorías']] as const,
    },
    academy: {
      label: 'FORMACIÓN',
      tagline: 'Formación práctica para fortalecer tu organización',
      body: 'Formación, certificación y herramientas prácticas desde principios bíblicos para fortalecer líderes, equipos y capacidades organizacionales, y ampliar el impacto físico, emocional y espiritual de las comunidades que sirven.',
      cta: 'Explora SIGUE Academy™',
      statsTitle: 'Nuestra formación en números',
      stats: [['10', 'Webinars en vivo'], ['96%', 'Satisfacción'], ['275', 'Participantes'], ['18', 'Semanas de programa']] as const,
      options: [
        {
          title: 'Certificación SIGUE™',
          subtitle: 'Fortalece tu organización en los 5 ejes SIGUE',
          body: 'Un proceso formativo que integra principios bíblicos, mejores prácticas organizacionales y herramientas aplicables, con aval universitario en alianza con la Fundación Universitaria Patricio Symes.',
          cta: 'Contáctanos para más información',
          href: '/contacto',
        },
        {
          title: 'Capacitación On-demand',
          subtitle: 'Herramientas prácticas para aplicar a tu ritmo',
          body: 'Microcursos y recursos flexibles para fortalecer capacidades específicas en áreas como diseño y gestión de programas, medición de impacto, liderazgo, alianzas, visibilidad y financiamiento.',
          cta: 'Mira el último webinar',
          href: '/recursos',
        },
      ],
    },
    hub: {
      label: 'CONEXIÓN',
      tagline: 'Comunidad, conexiones y oportunidades para ampliar tu impacto',
      body: 'Una comunidad de organizaciones, líderes y aliados que comparten valores, aprendizajes y oportunidades para conectar, colaborar y abrir nuevas posibilidades para sus organizaciones.',
      cta: 'Conéctate a SIGUE Hub™',
      statsTitle: 'Nuestra comunidad en números',
      stats: [['28', 'Promedio de participantes por sesión'], ['+325', 'Participaciones online'], ['92%', 'Satisfacción'], ['13', 'Reuniones comunidad']] as const,
      resources: [
        ['Comunidad online', 'Conecta, aprende y crece en red', 'Espacios de encuentro, aprendizaje y apoyo entre líderes y organizaciones que comparten valores, experiencias y desafíos.', 'Únete a la comunidad', '/miembros-sigue'],
        ['Blogs', 'Ideas prácticas para fortalecer tu misión', 'Contenido breve y accionable sobre estrategia, impacto, liderazgo, visibilidad, sostenibilidad y levantamiento de recursos.', 'Lee nuestros blogs', '/blog'],
        ['Herramientas', 'Recursos listos para poner en práctica', 'Plantillas, guías y matrices que facilitan la gestión, la medición de impacto, la comunicación y otros procesos clave de tu organización.', 'Explora las herramientas', '/herramientas-y-guias'],
        ['Eventos', 'Encuentros que conectan y abren oportunidades', 'Espacios en vivo para aprender, inspirarte, ampliar relaciones y conectar con aliados, oportunidades y nuevas formas de colaboración.', 'Ver próximos eventos', '/eventos'],
      ] as const,
    },
    fellows: {
      label: 'ACELERACIÓN',
      tagline: 'Aceleración intensiva para organizaciones listas para crecer',
      paragraphs: [
        'Programa de 18 semanas que combina mentoría 1:1, formación aplicada, trabajo sobre desafíos reales y capital semilla, desde principios bíblicos y una visión de transformación integral.',
        'Fortalece áreas clave para superar barreras de crecimiento, visibilizar y demostrar tu impacto, acceder a nuevas fuentes de financiamiento y ampliar tu alcance.',
      ],
      cta: 'Conoce SIGUE Fellows™',
      statsTitle: 'Nuestra aceleración en números',
      stats: [['18', 'Semanas de aceleración'], ['4', 'Organizaciones aceleradas'], ['27', 'Sesiones de aceleración'], ['$5k', 'Capital semilla']] as const,
      applyTitle: '¿Quiénes pueden aplicar a la aceleradora?',
      applyIntro: 'Organizaciones cristianas, miembros activos de SIGUE Network, con una base mínima para crecer y el compromiso de fortalecer y expandir su impacto.',
      requirementsTitle: 'Ver los requisitos',
      requirements: [
        'Ser miembro activo de SIGUE Network.',
        'Contar con personería jurídica vigente y cumplimiento normativo básico.',
        'Comprometer al menos 2 personas para participar activamente en el proceso.',
        'Tener un equipo mínimo de 3 personas y una junta o consejo asesor funcional.',
        'Tener programas en marcha y evidencia inicial de resultados.',
        'Contar con una base mínima de fondeo.',
        'Misión y visión claras y coherencia con valores cristianos.',
        'Servir activamente a comunidades y demostrar compromiso con la transformación integral.',
      ],
      applyCta: 'Quiero aplicar a SIGUE Fellows™',
      photoAlt: 'Familias de una comunidad acompañada por organizaciones de impacto',
    },
    scaleUp: {
      label: 'NUESTRO PUNTO DE PARTIDA',
      title: 'SIGUE',
      accent: 'Scale-Up Framework™',
      intro: 'La herramienta diagnóstica que evalúa tu organización en los 5 ejes SIGUE para identificar brechas y diseñar tu ruta de fortalecimiento.',
      brand: 'SIGUE Scale-Up™',
      subtitle: 'Autoevaluación diagnóstica por ejes',
      question: '¿No sabes por dónde empezar?',
      body: 'Descubre qué necesita fortalecer tu organización para crecer con mayor solidez, acceder a nuevas oportunidades de financiamiento y ampliar su impacto integral de las comunidades.',
      cta: 'Comienza tu autoevaluación gratuita SIGUE Scale-Up™',
      axes: [
        ['S', 'SERVIR', 'Propósito claro y necesidades comprendidas'],
        ['I', 'IMPACTAR', 'Resultados medibles y transformación visible'],
        ['G', 'GUIAR', 'Liderazgo saludable y capacidad compartida'],
        ['U', 'UNIR FUERZAS', 'Alianzas estratégicas que multiplican impacto'],
        ['E', 'EQUIPAR PARA EXPANDIR', 'Gestión sólida, recursos diversos y sostenibilidad'],
      ] as const,
    },
    numbers: {
      label: 'NUESTRO PRIMER AÑO',
      title: 'Impacto en',
      accent: 'números',
      intro: 'Durante nuestro primer año de operación, en 2025, movilizamos talento, conocimiento y recursos para fortalecer y conectar a quienes sirven comunidades, sentando las bases para multiplicar su impacto.',
      stats: [
        ['35', 'Organizaciones miembros al cierre del 2025'],
        ['108K', 'Personas impactadas por los miembros de SIGUE'],
        ['3', 'Consultorías'],
        ['5000+', 'Horas de voluntariado donadas'],
        ['$107K', 'Valor estimado del voluntariado en dólares'],
        ['202', 'Participantes en webinars · 96% satisfacción'],
        ['175', 'Participantes en comunidad online · 91% satisfacción'],
        ['22', 'Autoevaluadas y recibieron mentoría 1:1'],
      ] as const,
      quotes: [
        ['Gracias a SIGUE Network. Con sus herramientas completamos un plan para alcanzar cerca de 20,000 personas para 2036 con nuestro programa de ahorro y aprendizaje experiencial con valores.', 'JD', 'Jim y Diana', 'Investing Hope Foundation'],
        ['Gracias a SIGUE Network por invertir en nosotros. Con su apoyo para comunicar mejor la necesidad, logramos reunir en una semana los fondos para llevar a Colombia la máquina de sonograma.', 'JF', 'Janet y Fernando', 'Camec'],
      ] as const,
    },
    final: {
      title: 'Da el siguiente paso',
      accent: 'para fortalecer tu organización',
      body: 'No importa en qué etapa estés. En SIGUE puedes encontrar el punto de partida y la opción que mejor responde a tus necesidades.',
      photoAlt: 'Niño de una comunidad beneficiada por iniciativas de impacto',
      cards: [
        ['¿No sabes por dónde empezar?', 'Descubre dónde fortalecer tu organización', 'Completa la autoevaluación gratuita', '/sigue-tracks', 'help'],
        ['¿Ya sabes qué necesitas?', 'Conversemos sobre tu desafío', 'Hablemos', '/contacto', 'mail'],
        ['¿Quieres impulsar el impacto de otros?', 'Apoya a quienes sirven comunidades', 'Dona ahora', '/donacion', 'heart'],
      ] as const,
    },
  },
  en: {
    skip: 'Skip to content',
    hero: {
      label: 'OUR ECOSYSTEM',
      title: 'Different ways to',
      accent: 'help you grow and connect',
      body: 'Training, community, acceleration, and specialized guidance that you can combine according to your organization’s needs and capabilities, with practical tools, innovative strategies, and expert advice.',
      cta: 'Explore your options',
      identity: ['strengthen', '+', 'connect'],
    },
    impactIntro: {
      label: 'WHY IT MATTERS',
      title: 'When an organization grows stronger and connects',
      accent: 'its impact can reach farther',
      body: 'At SIGUE, we strengthen and connect those who serve so they can respond more effectively to their communities’ needs, reach farther, and expand their physical, emotional, and spiritual impact.',
      cta: 'Explore the SIGUE ecosystem',
      alt: 'A volunteer sharing with families in a community',
    },
    consulting: {
      label: 'GUIDANCE',
      tagline: 'Specialized guidance for specific challenges',
      body: 'We bring our nonprofit-sector experience, practical and innovative tools, and specialized guidance to your organization’s specific challenges.',
      bullets: [
        'Do your programs need to grow stronger to respond better, or do they seem stuck?',
        'Do you need to measure and communicate your impact more effectively?',
        'Do you need to strengthen leadership, boards, teams, or volunteers?',
        'Do you need greater visibility, connections, or partnerships?',
        'Do you need to strengthen your strategy and access funding?',
      ],
      cta: 'Let’s discuss your challenge',
      statsTitle: 'Our guidance in numbers',
      stats: [['6', 'Consulting engagements'], ['23', 'Mentoring sessions']] as const,
    },
    academy: {
      label: 'TRAINING',
      tagline: 'Practical training to strengthen your organization',
      body: 'Training, certification, and practical tools grounded in biblical principles to strengthen leaders, teams, and organizational capabilities and expand the physical, emotional, and spiritual impact of the communities they serve.',
      cta: 'Explore SIGUE Academy™',
      statsTitle: 'Our training in numbers',
      stats: [['10', 'Live webinars'], ['96%', 'Satisfaction'], ['275', 'Participants'], ['18', 'Program weeks']] as const,
      options: [
        {
          title: 'SIGUE™ Certification',
          subtitle: 'Strengthen your organization across the five SIGUE axes',
          body: 'A learning process that integrates biblical principles, organizational best practices, and applicable tools, with university endorsement in partnership with Fundación Universitaria Patricio Symes.',
          cta: 'Contact us for more information',
          href: '/contacto',
        },
        {
          title: 'On-demand training',
          subtitle: 'Practical tools to apply at your own pace',
          body: 'Flexible micro-courses and resources that strengthen specific capabilities in program design and management, impact measurement, leadership, partnerships, visibility, and funding.',
          cta: 'Watch the latest webinar',
          href: '/recursos',
        },
      ],
    },
    hub: {
      label: 'CONNECTION',
      tagline: 'Community, connections, and opportunities to expand your impact',
      body: 'A community of organizations, leaders, and allies who share values, learning, and opportunities to connect, collaborate, and open new possibilities for their organizations.',
      cta: 'Connect through SIGUE Hub™',
      statsTitle: 'Our community in numbers',
      stats: [['28', 'Average participants per session'], ['+325', 'Online participations'], ['92%', 'Satisfaction'], ['13', 'Community gatherings']] as const,
      resources: [
        ['Online community', 'Connect, learn, and grow together', 'Gathering, learning, and support spaces for leaders and organizations who share values, experiences, and challenges.', 'Join the community', '/miembros-sigue'],
        ['Blog', 'Practical ideas to strengthen your mission', 'Brief, actionable content on strategy, impact, leadership, visibility, sustainability, and fundraising.', 'Read our blog', '/blog'],
        ['Tools', 'Ready-to-use practical resources', 'Templates, guides, and matrices that make management, impact measurement, communication, and other key processes easier.', 'Explore the tools', '/herramientas-y-guias'],
        ['Events', 'Gatherings that connect and open opportunities', 'Live spaces to learn, be inspired, expand relationships, and connect with allies, opportunities, and new forms of collaboration.', 'See upcoming events', '/eventos'],
      ] as const,
    },
    fellows: {
      label: 'ACCELERATION',
      tagline: 'Intensive acceleration for organizations ready to grow',
      paragraphs: [
        'An 18-week program that combines one-to-one mentoring, applied training, work on real challenges, and seed capital, grounded in biblical principles and a vision of holistic transformation.',
        'Strengthen key areas to overcome growth barriers, make your impact visible and demonstrable, access new funding sources, and expand your reach.',
      ],
      cta: 'Explore SIGUE Fellows™',
      statsTitle: 'Our acceleration in numbers',
      stats: [['18', 'Weeks of acceleration'], ['4', 'Organizations accelerated'], ['27', 'Acceleration sessions'], ['$5k', 'Seed capital']] as const,
      applyTitle: 'Who can apply to the accelerator?',
      applyIntro: 'Christian organizations that are active SIGUE Network members, with a minimum foundation for growth and a commitment to strengthening and expanding their impact.',
      requirementsTitle: 'See the requirements',
      requirements: [
        'Be an active SIGUE Network member.',
        'Have current legal status and basic regulatory compliance.',
        'Commit at least two people to participate actively in the process.',
        'Have a team of at least three people and a functioning board or advisory council.',
        'Have active programs and initial evidence of results.',
        'Have a minimum funding base.',
        'Have a clear mission and vision aligned with Christian values.',
        'Actively serve communities and demonstrate a commitment to holistic transformation.',
      ],
      applyCta: 'Apply to SIGUE Fellows™',
      photoAlt: 'Families in a community served by impact organizations',
    },
    scaleUp: {
      label: 'OUR STARTING POINT',
      title: 'SIGUE',
      accent: 'Scale-Up Framework™',
      intro: 'The diagnostic tool that assesses your organization across the five SIGUE axes to identify gaps and design your strengthening path.',
      brand: 'SIGUE Scale-Up™',
      subtitle: 'Diagnostic self-assessment by axis',
      question: 'Not sure where to begin?',
      body: 'Discover what your organization needs to strengthen to grow on a firmer foundation, access new funding opportunities, and expand its holistic impact in communities.',
      cta: 'Start your free SIGUE Scale-Up™ self-assessment',
      axes: [
        ['S', 'SERVE', 'Clear purpose and understood needs'],
        ['I', 'IMPACT', 'Measurable results and visible transformation'],
        ['G', 'GUIDE', 'Healthy leadership and shared capacity'],
        ['U', 'UNITE', 'Strategic partnerships that multiply impact'],
        ['E', 'EQUIP TO EXPAND', 'Solid management, diverse resources, and sustainability'],
      ] as const,
    },
    numbers: {
      label: 'OUR FIRST YEAR',
      title: 'Impact by the',
      accent: 'numbers',
      intro: 'During our first year of operation in 2025, we mobilized talent, knowledge, and resources to strengthen and connect those who serve communities, laying the foundation to multiply their impact.',
      stats: [
        ['35', 'Member organizations at the end of 2025'],
        ['108K', 'People impacted by SIGUE members'],
        ['3', 'Consulting engagements'],
        ['5000+', 'Volunteer hours donated'],
        ['$107K', 'Estimated value of volunteer service in dollars'],
        ['202', 'Webinar participants · 96% satisfaction'],
        ['175', 'Online community participants · 91% satisfaction'],
        ['22', 'Assessed and received one-to-one mentoring'],
      ] as const,
      quotes: [
        ['Thanks to SIGUE Network and its tools, we completed a plan to reach nearly 20,000 people by 2036 through our savings and values-based experiential learning program.', 'JD', 'Jim and Diana', 'Investing Hope Foundation'],
        ['Thanks to SIGUE Network for investing in us. With its support in communicating the need, we raised in one week the funds needed to bring the ultrasound machine to Colombia.', 'JF', 'Janet and Fernando', 'Camec'],
      ] as const,
    },
    final: {
      title: 'Take the next step',
      accent: 'to strengthen your organization',
      body: 'No matter what stage you are in, SIGUE can help you find a starting point and the option that best responds to your needs.',
      photoAlt: 'A child from a community supported by impact initiatives',
      cards: [
        ['Not sure where to begin?', 'Discover where to strengthen your organization', 'Complete the free self-assessment', '/sigue-tracks', 'help'],
        ['Already know what you need?', 'Let’s talk about your challenge', 'Let’s talk', '/contacto', 'mail'],
        ['Want to advance the impact of others?', 'Support those who serve communities', 'Donate now', '/donacion', 'heart'],
      ] as const,
    },
  },
} as const;

function localize(locale: Locale, value: LocalizedText) {
  return value[locale === 'es' ? 0 : 1];
}

function LocalLink({ locale, href, children, className }: { locale: Locale; href: string; children: React.ReactNode; className?: string }) {
  return <Link className={className} href={`/${locale}${href}`}>{children}</Link>;
}

function BrandLogo({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return <Image className={styles.brandLogo} src={src} alt={alt} width={270} height={160} priority={priority} />;
}

function StatsPanel({ title, stats, icon }: { title: string; stats: readonly (readonly [string, string])[]; icon: React.ReactNode }) {
  return (
    <aside className={styles.statsPanel}>
      <div className={styles.statsHeading}>{icon}<h3>{title}</h3></div>
      <div className={styles.statsGrid}>
        {stats.map(([value, label]) => <div className={styles.statCard} key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></div>)}
      </div>
    </aside>
  );
}

export default function EcosystemLanding({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <div className={styles.page} data-ecosystem-page>
      <a className={styles.skipLink} href="#ecosystem-content">{c.skip}</a>
      <main id="ecosystem-content">
        <section className={styles.hero} aria-labelledby="ecosystem-title">
          <div className={styles.heroIdentity} aria-label={`${c.hero.identity[0]} ${c.hero.identity[1]} ${c.hero.identity[2]}`}>
            <span>{c.hero.identity[0]}</span><b>{c.hero.identity[1]}</b><span>{c.hero.identity[2]}</span>
          </div>
          <p className={styles.eyebrowLight}>{c.hero.label}</p>
          <h1 id="ecosystem-title"><strong>{c.hero.title}</strong><em>{c.hero.accent}</em></h1>
          <p className={styles.heroBody}>{c.hero.body}</p>
          <a className={styles.primaryButton} href="#opciones">{c.hero.cta}</a>
          <span className={styles.heroSquare} aria-hidden="true" />
        </section>

        <nav className={styles.logoRail} aria-label={locale === 'es' ? 'Opciones del ecosistema' : 'Ecosystem options'}>
          {serviceCards.map((card) => (
            <LocalLink locale={locale} href={card.href} className={styles.logoTile} key={card.alt}>
              <BrandLogo src={card.logo} alt={card.alt} priority />
            </LocalLink>
          ))}
        </nav>

        <section className={styles.impactIntro} aria-labelledby="impact-intro-title">
          <div className={styles.impactPhoto}>
            <Image src="/images/ecosistema-2026/impact-community.webp" alt={c.impactIntro.alt} fill sizes="100vw" priority />
          </div>
          <div className={styles.impactCopy}>
            <p className={styles.eyebrowLight}>{c.impactIntro.label}</p>
            <h2 id="impact-intro-title"><strong>{c.impactIntro.title}</strong><em>{c.impactIntro.accent}</em></h2>
            <p>{c.impactIntro.body}</p>
            <a className={styles.primaryButton} href="#opciones">{c.impactIntro.cta}</a>
            <span className={styles.impactSquare} aria-hidden="true" />
          </div>
        </section>

        <section id="opciones" className={styles.options} aria-label={locale === 'es' ? 'Opciones del ecosistema SIGUE' : 'SIGUE ecosystem options'}>
          <div className={styles.optionsGrid}>
            {serviceCards.map((card) => (
              <article className={styles.optionCard} key={card.alt}>
                <p>{localize(locale, card.kicker)}</p>
                <BrandLogo src={card.logo} alt={card.alt} />
                <strong>{localize(locale, card.question)}</strong>
                <em>{localize(locale, card.body)}</em>
                <LocalLink locale={locale} href={card.href}>{localize(locale, card.cta)}</LocalLink>
              </article>
            ))}
          </div>
          <Gauge className={styles.optionsGauge} aria-hidden="true" />
        </section>

        <div className={styles.sectionDivider}><span /></div>

        <section className={`${styles.serviceSection} ${styles.consulting}`} aria-labelledby="consulting-title">
          <div className={styles.serviceMain}>
            <p className={styles.eyebrow}>{c.consulting.label}</p>
            <BrandLogo src="/images/home-2026/sigue-consulting-transparent.png" alt="SIGUE Consulting" />
            <h2 id="consulting-title">{c.consulting.tagline}</h2>
            <div className={styles.copyCard}>
              <p>{c.consulting.body}</p>
              <ul>{c.consulting.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </div>
            <LocalLink locale={locale} href="/contacto" className={styles.primaryButton}>{c.consulting.cta}</LocalLink>
          </div>
          <StatsPanel title={c.consulting.statsTitle} stats={c.consulting.stats} icon={<HandHeart aria-hidden="true" />} />
        </section>

        <div className={styles.sectionDivider}><span /></div>

        <section className={`${styles.serviceSection} ${styles.academy}`} aria-labelledby="academy-title">
          <StatsPanel title={c.academy.statsTitle} stats={c.academy.stats} icon={<GraduationCap aria-hidden="true" />} />
          <div className={styles.serviceMain}>
            <p className={styles.eyebrow}>{c.academy.label}</p>
            <BrandLogo src="/images/home-2026/sigue-academy-transparent.png" alt="SIGUE Academy" />
            <h2 id="academy-title">{c.academy.tagline}</h2>
            <div className={styles.copyCard}><p>{c.academy.body}</p></div>
            <LocalLink locale={locale} href="/sigue-academy" className={styles.primaryButton}>{c.academy.cta}</LocalLink>
          </div>
          <div className={styles.academyOptions}>
            {c.academy.options.map((option) => (
              <article className={styles.learningCard} key={option.title}>
                <h3>{option.title}</h3><strong>{option.subtitle}</strong><p>{option.body}</p>
                <LocalLink locale={locale} href={option.href} className={styles.primaryButton}>{option.cta}</LocalLink>
              </article>
            ))}
          </div>
        </section>

        <div className={styles.sectionDivider}><span /></div>

        <section className={`${styles.serviceSection} ${styles.hub}`} aria-labelledby="hub-title">
          <div className={styles.serviceMain}>
            <p className={styles.eyebrow}>{c.hub.label}</p>
            <BrandLogo src="/images/home-2026/sigue-hub-transparent.png" alt="SIGUE Hub" />
            <h2 id="hub-title">{c.hub.tagline}</h2>
            <div className={styles.copyCard}><p>{c.hub.body}</p></div>
            <LocalLink locale={locale} href="/sigue-hub" className={styles.primaryButton}>{c.hub.cta}</LocalLink>
          </div>
          <StatsPanel title={c.hub.statsTitle} stats={c.hub.stats} icon={<Network aria-hidden="true" />} />
          <div className={styles.hubResources}>
            {c.hub.resources.map(([title, subtitle, body, cta, href]) => (
              <article className={styles.resourceCard} key={title}>
                <h3>{title}</h3><strong>{subtitle}</strong><p>{body}</p>
                <LocalLink locale={locale} href={href}>{cta}</LocalLink>
              </article>
            ))}
          </div>
        </section>

        <div className={styles.sectionDivider}><span /></div>

        <section className={`${styles.serviceSection} ${styles.fellows}`} aria-labelledby="fellows-title">
          <StatsPanel title={c.fellows.statsTitle} stats={c.fellows.stats} icon={<Gauge aria-hidden="true" />} />
          <div className={styles.serviceMain}>
            <p className={styles.eyebrow}>{c.fellows.label}</p>
            <BrandLogo src="/images/home-2026/sigue-fellows-transparent.png" alt="SIGUE Fellows" />
            <h2 id="fellows-title">{c.fellows.tagline}</h2>
            <div className={styles.copyCard}>{c.fellows.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <LocalLink locale={locale} href="/contacto" className={styles.primaryButton}>{c.fellows.cta}</LocalLink>
          </div>
        </section>

        <section className={styles.requirements} aria-labelledby="requirements-title">
          <div className={styles.requirementsPhoto}>
            <Image src="/images/ecosistema-2026/fellows-community.webp" alt={c.fellows.photoAlt} fill sizes="(max-width: 760px) 100vw, 37vw" />
          </div>
          <div className={styles.requirementsCopy}>
            <h2 id="requirements-title">{c.fellows.applyTitle}</h2>
            <p>{c.fellows.applyIntro}</p>
            <h3>{c.fellows.requirementsTitle} <span aria-hidden="true">→</span></h3>
            <ul>{c.fellows.requirements.map((item) => <li key={item}><span aria-hidden="true" />{item}</li>)}</ul>
            <LocalLink locale={locale} href="/contacto" className={styles.primaryButton}>{c.fellows.applyCta}</LocalLink>
          </div>
        </section>

        <section className={styles.scaleUp} aria-labelledby="scale-up-title">
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{c.scaleUp.label}</p>
            <h2 id="scale-up-title"><strong>{c.scaleUp.title}</strong><em>{c.scaleUp.accent}</em></h2>
            <p>{c.scaleUp.intro}</p>
          </header>
          <div className={styles.scaleUpBody}>
            <div className={styles.scaleUpCopy}>
              <div className={styles.scaleUpBrand}><Activity aria-hidden="true" /><div><strong>{c.scaleUp.brand}</strong><span>{c.scaleUp.subtitle}</span></div></div>
              <h3>{c.scaleUp.question}</h3>
              <p>{c.scaleUp.body}</p>
              <LocalLink locale={locale} href="/sigue-tracks" className={styles.primaryButton}>{c.scaleUp.cta}</LocalLink>
            </div>
            <div className={styles.axesPanel}>
              {c.scaleUp.axes.map(([letter, title, body], index) => (
                <article className={styles.axisCard} data-axis={index + 1} key={letter}>
                  <span>{letter}</span><strong>{title}</strong><small>{body}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="impacto" className={styles.numbers} aria-labelledby="numbers-title">
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{c.numbers.label}</p>
            <h2 id="numbers-title"><strong>{c.numbers.title}</strong><em>{c.numbers.accent}</em></h2>
            <p>{c.numbers.intro}</p>
          </header>
          <div className={styles.numbersBand}>
            {c.numbers.stats.map(([value, label]) => <div className={styles.numberCard} key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
          <div className={styles.testimonials}>
            {c.numbers.quotes.map(([quote, initials, names, organization]) => (
              <blockquote key={organization}>
                <span className={styles.quoteMark} aria-hidden="true">“</span>
                <p>{quote}</p>
                <footer><b>{initials}</b><span><strong>{names}</strong>{organization}</span></footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="final-title">
          <div className={styles.finalIntro}>
            <div className={styles.finalPhoto}><Image src="/images/ecosistema-2026/final-child.webp" alt={c.final.photoAlt} fill sizes="(max-width: 760px) 100vw, 36vw" /></div>
            <div className={styles.finalCopy}><h2 id="final-title"><strong>{c.final.title}</strong><em>{c.final.accent}</em></h2><p>{c.final.body}</p></div>
          </div>
          <div className={styles.finalCards}>
            {c.final.cards.map(([title, body, cta, href, icon]) => {
              const Icon = icon === 'help' ? HelpCircle : icon === 'mail' ? Mail : Heart;
              return (
                <article key={title}>
                  <Icon aria-hidden="true" /><h3>{title}</h3><p>{body}</p>
                  <LocalLink locale={locale} href={href}>{cta}</LocalLink>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
