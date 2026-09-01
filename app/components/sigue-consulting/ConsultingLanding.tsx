import Image from 'next/image';
import Link from 'next/link';
import SiteFooter2026 from '@/app/components/site-2026/SiteFooter2026';
import styles from './ConsultingLanding.module.css';

type Locale = 'es' | 'en';

const images = {
  founder: 'https://siguenetwork.org/wp-content/uploads/2025/04/Sandra-B-en-la-banca.jpg',
  map: 'https://siguenetwork.org/wp-content/uploads/2025/04/Mapa-Azul-y-amarilllo-para-editar-tamano.jpg',
  community: 'https://siguenetwork.org/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-12-at-6.19.57-PM.jpeg',
  ngo: 'https://siguenetwork.org/wp-content/uploads/2024/11/siguenetwork_fes.jpg',
  company: 'https://siguenetwork.org/wp-content/uploads/2024/10/transformacion_integral_rsei_siguenetwork.jpg',
  territory: 'https://siguenetwork.org/wp-content/uploads/2024/10/siguenetwork_estrategias_territoriales.jpg',
};

const content = {
  es: {
    hero: {
      badge: ['SIGUE', 'Consulting'],
      title: 'Potencia tu impacto con estrategias de transformación física, emocional y espiritual',
      cta: 'Solicita una consulta estratégica ahora',
      alt: 'Profesionales desarrollando una estrategia',
    },
    intro: {
      title: 'Diagnóstico, diseño e implementación de estrategias para generar impacto integral, sostenible y escalable en comunidades.',
      body: 'En SIGUE Consulting ofrecemos asesoría estratégica personalizada para que ONGs, proyectos sociales y empresas potencien su impacto. Nuestro enfoque integra estrategias innovadoras, sostenibilidad financiera y alianzas clave para generar una transformación duradera en lo físico, emocional y espiritual.',
      benefitsTitle: 'Beneficios clave',
      benefits: [
        ['Estrategias personalizadas', 'Diseñamos planes adaptados para optimizar operaciones, alcance, visibilidad e impacto.'],
        ['Alianzas estratégicas', 'Facilitamos conexiones con aliados que amplifican tu misión, recursos e impacto.'],
        ['Sostenibilidad y escala', 'Implementamos modelos de gestión para asegurar sostenibilidad y crecimiento.'],
      ],
      cta: 'Contáctanos hoy mismo para saber cómo podemos potenciar tu organización',
    },
    audience: {
      titleBefore: '¿Para quién es',
      titleAfter: 'Consulting?',
      body: 'Trabajamos con organizaciones que buscan fortalecer su impacto, mejorar su sostenibilidad y escalar la transformación en las comunidades que sirven.',
      statements: [
        'Si lideras una ONG o un proyecto social, te ayudamos a estructurar, financiar y fortalecer tu labor usando los cinco ejes del Método SIGUE™.',
        'Si lideras una empresa, te guiamos en la creación de estrategias de RSE integral y sostenible con el Método de los Cinco Sentidos™.',
        'Si representas una asociación cristiana con incidencia territorial, te ayudamos a optimizar recursos y ampliar tu impacto comunitario.',
      ],
      profileTitle: 'Elige tu perfil y descubre cómo potenciar tu impacto:',
      profiles: [
        ['ONGs y proyectos sociales', 'Maximiza tu impacto, mejora tu implementación y accede a nuevas fuentes de financiamiento.', 'DESCUBRE CÓMO', '#ongs'],
        ['Empresas', 'Transforma tus proyectos empresariales en una estrategia de RSE integral.', 'CONOCE CÓMO', '#empresas'],
        ['Asociaciones cristianas con incidencia territorial', 'Optimiza recursos y amplía tu impacto territorial con estrategias avanzadas.', 'EXPLORA CÓMO', '#asociaciones'],
      ],
    },
    services: [
      {
        id: 'ongs',
        title: 'Transformación integral FES para ONGs y proyectos sociales',
        subtitle: 'Diagnóstico, diseño e implementación de proyectos y ONGs de impacto FES',
        body: 'Potenciamos y conectamos tu proyecto y organización para maximizar su impacto con nuestro Método SIGUE™.',
        image: images.ngo,
        alt: 'Equipo de una organización social',
        items: [
          ['¿Qué ofrecemos?', 'Evaluación inicial, diseño personalizado, capacitación y mentoría para fortalecer operaciones, visibilidad y sostenibilidad.'],
          ['Método SIGUE', 'Servir, Impactar, Guiar, Unir fuerzas y Empoderar para expandir: cinco áreas para convertir tu propósito en impacto medible.'],
          ['Capacitación y mentoría', 'Talleres, webinars y sesiones personalizadas con expertos para mejorar tu gestión y efectividad.'],
          ['Certificación SIGUE', 'Preparación para demostrar impacto, elevar estándares y conectarte con oportunidades de financiamiento.'],
          ['Membresía SIGUE Network', 'Comunidad, recursos exclusivos, acompañamiento y alianzas alineadas con tu misión.'],
          ['¿Por qué elegirnos?', 'Acompañamiento personalizado, método comprobado, enfoque integral y una red que amplifica tu alcance.'],
        ],
        closing: '¡Conoce cómo nuestro enfoque puede transformar tu ONG y proyecto social integral!',
      },
      {
        id: 'empresas',
        title: 'EMPRESAS',
        subtitle: 'Estrategias de Responsabilidad Social Empresarial Integral (RSEI) que logran impacto FES',
        body: 'Potenciamos y conectamos tu empresa con el Método de los Cinco Sentidos™, alineando propósito, acción y resultados.',
        image: images.company,
        alt: 'Equipo empresarial diseñando una estrategia',
        items: [
          ['¿Qué ofrecemos?', 'Diagnóstico, diseño e implementación de estrategias de RSE integral, sostenibles y medibles.'],
          ['Estrategia de comunicación', 'Amplificamos tu impacto social y posicionamos a tu empresa como referente en responsabilidad social integral.'],
          ['Medición integral del impacto', 'Evaluamos resultados tangibles e intangibles para identificar logros y oportunidades de mejora.'],
          ['Membresía SIGUE Network', 'Conectamos tu empresa con ONGs, asociaciones y aliados para implementar iniciativas alineadas con su visión.'],
        ],
        closing: '¡Conoce cómo nuestro enfoque puede transformar tu estrategia de RSEI!',
      },
      {
        id: 'asociaciones',
        title: 'ASOCIACIONES CRISTIANAS CON ENFOQUE TERRITORIAL',
        subtitle: 'Estrategias para el impacto FES de territorios',
        body: 'Potenciamos y conectamos tu asociación para maximizar su impacto y optimizar recursos mediante estrategias territoriales avanzadas.',
        image: images.territory,
        alt: 'Comunidad observando su territorio',
        items: [
          ['¿Qué ofrecemos?', 'Diagnóstico, diseño e implementación de estrategias que responden a las necesidades reales del territorio.'],
          ['Mapeo territorial avanzado', 'Usamos tecnología SIG e inteligencia de mercado para identificar necesidades, recursos y oportunidades.'],
          ['Creación de alianzas estratégicas', 'Conectamos asociaciones, empresas y proyectos sociales para multiplicar recursos e impacto.'],
          ['Facilitación de proyectos de impacto integral', 'Diseñamos iniciativas que atienden las dimensiones física, emocional y espiritual.'],
          ['Membresía SIGUE Network', 'Acceso a una comunidad colaborativa, recursos exclusivos y aliados estratégicos.'],
          ['Nos diferencia', 'Integramos datos, visión comunitaria y colaboración para construir planes sostenibles y significativos.'],
        ],
        closing: 'Conoce cómo nuestro enfoque puede transformar tu estrategia territorial.',
      },
    ],
    contact: 'CONÉCTATE CON NOSOTROS',
    newsletter: ['Mantente al día con nuestras iniciativas y aprende cómo puedes involucrarte.', 'Suscríbete ahora y sé parte del cambio con SIGUE Network.', 'Tu correo electrónico', 'Suscríbete'],
  },
  en: {
    hero: {
      badge: ['SIGUE', 'Consulting'],
      title: 'Boost your impact with physical, emotional, and spiritual transformation strategies',
      cta: 'Request a strategic consultation now',
      alt: 'Professionals developing a strategy',
    },
    intro: {
      title: 'Diagnosis, design, and implementation of strategies for holistic, sustainable, and scalable community impact.',
      body: 'SIGUE Consulting provides personalized strategic guidance for NGOs, social projects, and businesses. Our approach combines innovative strategies, financial sustainability, and key alliances to create lasting physical, emotional, and spiritual transformation.',
      benefitsTitle: 'Key benefits',
      benefits: [
        ['Personalized strategies', 'Plans adapted to optimize operations, reach, visibility, and impact.'],
        ['Strategic alliances', 'Connections with partners who amplify your mission, resources, and impact.'],
        ['Sustainability and scale', 'Management models that support sustainable growth.'],
      ],
      cta: 'Contact us to discover how we can strengthen your organization',
    },
    audience: {
      titleBefore: 'Who is',
      titleAfter: 'Consulting for?',
      body: 'We work with organizations seeking to strengthen their impact, improve sustainability, and scale transformation in the communities they serve.',
      statements: [
        'If you lead an NGO or social project, we help you structure, fund, and strengthen your work through the five areas of the SIGUE Method™.',
        'If you lead a business, we guide you in developing holistic, sustainable CSR strategies through the Five Senses Method™.',
        'If you represent a Christian association with territorial reach, we help optimize resources and expand community impact.',
      ],
      profileTitle: 'Choose your profile and discover how to strengthen your impact:',
      profiles: [
        ['NGOs and social projects', 'Maximize impact, improve implementation, and access new funding sources.', 'DISCOVER HOW', '#ongs'],
        ['Businesses', 'Turn corporate projects into a holistic CSR strategy.', 'LEARN HOW', '#empresas'],
        ['Christian territorial associations', 'Optimize resources and expand territorial impact through advanced strategies.', 'EXPLORE HOW', '#asociaciones'],
      ],
    },
    services: [
      {
        id: 'ongs', title: 'Holistic FES transformation for NGOs and social projects', subtitle: 'Diagnosis, design, and implementation of FES impact initiatives', body: 'We strengthen and connect your project through the SIGUE Method™ to maximize its impact.', image: images.ngo, alt: 'Social organization team',
        items: [['What do we offer?', 'Initial assessment, customized design, training, and mentoring.'], ['SIGUE Method', 'Serve, Impact, Guide, Unite, and Empower to expand.'], ['Training and mentoring', 'Workshops, webinars, and personalized sessions with experts.'], ['SIGUE Certification', 'Preparation to demonstrate impact and access funding opportunities.'], ['SIGUE Network membership', 'Community, exclusive resources, support, and alliances.'], ['Why choose us?', 'Personalized guidance, a proven method, and a holistic approach.']],
        closing: 'Discover how our approach can transform your NGO or social project.',
      },
      {
        id: 'empresas', title: 'BUSINESSES', subtitle: 'Holistic Corporate Social Responsibility strategies that achieve FES impact', body: 'We strengthen your company through the Five Senses Method™, aligning purpose, action, and results.', image: images.company, alt: 'Business team developing a strategy',
        items: [['What do we offer?', 'Diagnosis, design, and implementation of sustainable, measurable CSR strategies.'], ['Communication strategy', 'We amplify social impact and position your company as a responsible leader.'], ['Holistic impact measurement', 'We assess tangible and intangible results.'], ['SIGUE Network membership', 'Connections with NGOs, associations, and strategic partners.']],
        closing: 'Discover how our approach can transform your CSR strategy.',
      },
      {
        id: 'asociaciones', title: 'CHRISTIAN ASSOCIATIONS WITH A TERRITORIAL FOCUS', subtitle: 'Strategies for holistic FES territorial impact', body: 'We strengthen your association and optimize resources through advanced territorial strategies.', image: images.territory, alt: 'Community observing its territory',
        items: [['What do we offer?', 'Strategies based on the real needs of the territory.'], ['Advanced territorial mapping', 'GIS technology and market intelligence identify needs and resources.'], ['Strategic alliances', 'Connections that multiply resources and impact.'], ['Holistic project design', 'Initiatives addressing physical, emotional, and spiritual needs.'], ['SIGUE Network membership', 'Collaborative community, resources, and strategic partners.'], ['What sets us apart', 'Data, community vision, and collaboration for sustainable plans.']],
        closing: 'Discover how our approach can transform your territorial strategy.',
      },
    ],
    contact: 'CONNECT WITH US',
    newsletter: ['Stay up to date with our initiatives and learn how to get involved.', 'Subscribe and become part of the change with SIGUE Network.', 'Your email address', 'Subscribe'],
  },
} as const;

function ContactButton({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Link className={styles.button} href={`/${locale}/contacto`}>{children}</Link>;
}

export default function ConsultingLanding({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <div className={styles.page} data-consulting-page>
      <section className={styles.hero} aria-labelledby="consulting-title">
        <Image src="/images/ConsultingHeroSection.jpg" alt={c.hero.alt} fill priority sizes="100vw" />
        <div className={styles.heroPanel}>
          <span><strong>{c.hero.badge[0]}</strong>{c.hero.badge[1]}</span>
          <div><h1 id="consulting-title">{c.hero.title}</h1><ContactButton locale={locale}>{c.hero.cta}</ContactButton></div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="consulting-intro-title">
        <div className={styles.introLead}>
          <div className={styles.introImage}><Image src={images.founder} alt="" fill unoptimized sizes="42vw" /></div>
          <h2 id="consulting-intro-title">{c.intro.title}</h2>
        </div>
        <div className={styles.introBody}>
          <div className={styles.mapImage}><Image src={images.map} alt="" fill unoptimized sizes="35vw" /></div>
          <p>{c.intro.body}</p>
        </div>
        <div className={styles.benefits}>
          <h2>{c.intro.benefitsTitle}</h2>
          <div>{c.intro.benefits.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
          <ContactButton locale={locale}>{c.intro.cta}</ContactButton>
        </div>
      </section>

      <section className={styles.audience} aria-labelledby="consulting-audience-title">
        <div className={styles.audienceHero}>
          <span aria-hidden="true" />
          <div className={styles.audienceImage}><Image src={images.community} alt="" fill unoptimized sizes="30vw" /></div>
          <h2 id="consulting-audience-title"><span>{c.audience.titleBefore}</span><strong>SIGUE</strong><span>{c.audience.titleAfter}</span></h2>
        </div>
        <div className={styles.audienceIntro}><p>{c.audience.body}</p><div aria-hidden="true" /></div>
        <div className={styles.audienceStatements}>{c.audience.statements.map((statement) => <p key={statement}>{statement}</p>)}</div>
        <h3 className={styles.profileHeading}>{c.audience.profileTitle}</h3>
        <div className={styles.profiles}>{c.audience.profiles.map(([title, body, cta, href]) => <article key={href}><h3>{title}</h3><p>{body}</p><a className={styles.button} href={href}>{cta}</a></article>)}</div>
      </section>

      <div className={styles.services}>
        {c.services.map((service, index) => (
          <section id={service.id} className={styles.service} key={service.id}>
            <div className={`${styles.serviceIntro} ${index % 2 ? styles.serviceIntroReverse : ''}`}>
              <div className={styles.serviceImage}><Image src={service.image} alt={service.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 42vw" /></div>
              <div><h2>{service.title}</h2><h3>{service.subtitle}</h3><p>{service.body}</p></div>
            </div>
            <div className={styles.accordions}>{service.items.map(([title, body]) => <details key={title}><summary>{title}</summary><p>{body}</p></details>)}</div>
            <p className={styles.serviceClosing}>{service.closing}</p>
            <ContactButton locale={locale}>{c.contact}</ContactButton>
          </section>
        ))}
      </div>

      <section className={styles.newsletter}>
        <h2>{c.newsletter[0]}</h2><p>{c.newsletter[1]}</p>
        <form action={`/${locale}/contacto`} method="get"><label className={styles.srOnly} htmlFor={`consulting-email-${locale}`}>{c.newsletter[2]}</label><input id={`consulting-email-${locale}`} name="email" type="email" placeholder={c.newsletter[2]} required /><button type="submit">{c.newsletter[3]}</button></form>
      </section>
      <SiteFooter2026 locale={locale} />
    </div>
  );
}
