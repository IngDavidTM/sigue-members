import Image from 'next/image';
import Link from 'next/link';
import styles from './AcademyLanding.module.css';

type Locale = 'es' | 'en';

const images = {
  hero: 'https://siguenetwork.org/wp-content/uploads/2024/11/sigue_academy_siguenetwork.png',
  intro: 'https://siguenetwork.org/wp-content/uploads/2024/10/miembros_siguenetwork_header-1024x682.jpg',
};

const content = {
  es: {
    hero: {
      badge: 'SIGUE ACADEMY',
      title: '¡Lleva tu proyecto social, u organización sin ánimo de lucro, al siguiente nivel con la Certificación SIGUE!',
      body: 'Fortalece tu organización, demuestra tu impacto y prepárate para crecer de manera sostenible.',
      cta: 'CONÓCENOS',
      alt: 'Equipo de SIGUE Academy en una sesión de formación',
    },
    intro: {
      eyebrow: 'CERTIFICACIÓN SIGUE',
      title: 'Certificación SIGUE: eleva tu proyecto y expande tu impacto',
      body: 'La Certificación SIGUE es una herramienta de transformación integral que fortalece a las organizaciones y proyectos sociales con base en principios cristianos. Diseñada para llevar los proyectos a un nuevo nivel de excelencia y sostenibilidad, esta certificación te ofrece el respaldo y las herramientas necesarias para impactar a las comunidades de forma física, emocional y espiritual, mientras superas los desafíos de FE: ser financiable y encontrable.',
      cta: 'EXPLORA LA CERTIFICACIÓN',
      alt: 'Miembros de SIGUE Network reunidos',
    },
    questionsTitle: '¿Es esta certificación para ti?',
    questionsIntro: 'Evalúa si la Certificación SIGUE responde a las necesidades de tu proyecto:',
    questions: [
      '¿Tu proyecto necesita una misión alineada y un enfoque claro?',
      '¿Te cuesta demostrar el impacto real de tu proyecto?',
      '¿Estás luchando para expandir tu proyecto sin perder calidad?',
      '¿Te gustaría que tu proyecto fuera más visible y reconocible?',
      '¿Sientes que tu proyecto está aislado y necesita alianzas estratégicas?',
      '¿Buscas liderar con propósito y valores sólidos?',
      '¿Necesitas recursos financieros para seguir expandiendo tu alcance e impacto?',
      '¿Te gustaría acceder a financiamiento a través de SIGUE Network?',
    ],
    questionsClosing: 'Si dijiste SÍ a una o más de estas preguntas, la certificación es para ti.',
    questionsCta: 'DESCUBRE CÓMO COMENZAR',
    why: {
      eyebrow: 'CRECE CON PROPÓSITO',
      title: '¿Por qué certificarte con SIGUE?',
      body: 'La Certificación SIGUE te prepara para superar desafíos clave en la gestión y crecimiento de proyectos sociales, asegurando que tu proyecto esté alineado con los requisitos que se deben cumplir en un ambiente competitivo de financiamiento.',
      cta: 'SOLICITA INFORMACIÓN',
    },
    certified: {
      eyebrow: 'IMPACTO QUE SE PUEDE VER',
      title: '¿Cómo se ve un proyecto certificado por SIGUE?',
      body: 'Un proyecto que ha pasado por la Certificación SIGUE no solo se fortalece para acceder a fuentes de financiamiento, sino que se transforma integralmente en su impacto físico, emocional y espiritual en la comunidad. La certificación eleva a los proyectos y ONGs a un nuevo nivel de excelencia y sostenibilidad, alineados a principios cristianos.',
    },
    outcomesTitle: '¿Qué cambios notarás en tu organización?',
    outcomes: [
      ['Propósito y enfoque claros', 'Contar con un propósito bien definido y conocer a tu comunidad beneficiaria es esencial tanto para la transformación integral como para atraer financiamiento. Los financiadores valoran un enfoque claro que refleje un compromiso auténtico.'],
      ['Impacto medible y transparente', 'Medir y comunicar el impacto físico, emocional y espiritual asegura que los cambios son reales y sostenibles, generando confianza en la comunidad y en los financiadores, quienes buscan proyectos con resultados comprobables.'],
      ['Crecimiento sostenible y gestión eficiente', 'La gestión eficiente y el crecimiento sostenible garantizan que cada recurso se utiliza de manera óptima para maximizar el impacto. Esto no solo es clave para la integridad del proyecto, sino que también genera confianza en los donantes.'],
      ['Visibilidad y reconocimiento', 'La visibilidad es fundamental para un proyecto transformador. Con una estrategia de comunicación sólida, el proyecto se convierte en un referente, aumentando su capacidad para atraer apoyo y expandir su misión.'],
      ['Redes de colaboración estratégicas', 'Alianzas y redes estratégicas multiplican el impacto integral del proyecto, permitiendo la colaboración con otros agentes de cambio. Los financiadores valoran las sinergias que demuestran un enfoque compartido y coordinado para resolver necesidades.'],
      ['Liderazgo fortalecido y desarrollo personal', 'La transformación integral comienza con líderes comprometidos en su desarrollo personal y en vivir los valores que inspiran al proyecto. Este liderazgo sólido es clave para un impacto sostenido y responsable, inspirando tanto a la comunidad como a los donantes.'],
      ['Requisito de certificación para financiamiento', 'La Certificación SIGUE es un requisito para conectar con fuentes de financiamiento, asegurando que tu proyecto cumple con altos estándares de impacto y gestión que los financiadores buscan, con una base en principios cristianos.'],
    ],
    apply: 'APLICA A LA CERTIFICACIÓN',
    noEvents: 'No hay eventos de certificación programados actualmente.',
    contact: 'Déjanos tus datos y te avisaremos sobre la próxima convocatoria.',
  },
  en: {
    hero: {
      badge: 'SIGUE ACADEMY',
      title: 'Take your social project or nonprofit organization to the next level with SIGUE Certification!',
      body: 'Strengthen your organization, demonstrate your impact, and prepare to grow sustainably.',
      cta: 'MEET SIGUE',
      alt: 'SIGUE Academy team in a training session',
    },
    intro: {
      eyebrow: 'SIGUE CERTIFICATION',
      title: 'SIGUE Certification: elevate your project and expand your impact',
      body: 'SIGUE Certification is a holistic strengthening process for organizations and social projects seeking to build capacity, measure results, and demonstrate readiness for growth. Through the SIGUE Method™, you receive training, tools, and guidance to move forward with purpose and sustainability.',
      cta: 'I WANT TO LEARN MORE',
      alt: 'SIGUE Network members gathered together',
    },
    questionsTitle: 'Is this certification right for you?',
    questionsIntro: 'Consider whether SIGUE Certification responds to your project’s needs:',
    questions: [
      'Does your project need an aligned mission and a clear focus?',
      'Do you struggle to demonstrate your project’s real impact?',
      'Are you trying to expand without losing quality?',
      'Would you like your project to be more visible and recognized?',
      'Does your project feel isolated and in need of strategic alliances?',
      'Do you want to lead with purpose and strong values?',
      'Do you need financial resources to continue expanding your reach and impact?',
      'Would you like to access funding through SIGUE Network?',
    ],
    questionsClosing: 'If you answered YES to one or more, SIGUE Certification may be the next step toward strengthening your organization.',
    questionsCta: 'DISCOVER HOW TO GET STARTED',
    why: {
      eyebrow: 'GROW WITH PURPOSE',
      title: 'Why earn SIGUE Certification?',
      body: 'A stronger organization can serve better, build trust, and multiply its impact. Certification helps organize your strategy, consolidate capabilities, and build clear evidence of the change you create.',
      cta: 'TALK TO OUR TEAM',
    },
    certified: {
      eyebrow: 'IMPACT YOU CAN SEE',
      title: 'What does a SIGUE-certified project look like?',
      body: 'It has solid foundations, measurable results, healthy leadership, strategic alliances, and a clear path to grow without losing its essence.',
    },
    outcomesTitle: 'With certification, your organization will be better prepared for:',
    outcomes: [
      ['Clear purpose and focus', 'Align mission, decisions, and actions with the community’s real needs.'],
      ['Measurable, transparent impact', 'Define indicators, document results, and communicate transformation with evidence.'],
      ['Sustainable growth and efficient management', 'Optimize resources, strengthen processes, and expand without compromising quality.'],
      ['Visibility and recognition', 'Present a strong proposal that earns trust from donors, allies, and communities.'],
      ['Strategic collaboration networks', 'Connect with organizations and leaders who share your values and can multiply impact.'],
      ['Stronger leadership and personal development', 'Develop teams capable of serving, guiding, and making purposeful decisions.'],
      ['Certification requirement for funding', 'Certification prepares organizations to apply for funding opportunities available through SIGUE Network.'],
    ],
    apply: 'APPLY FOR CERTIFICATION',
    noEvents: 'There are currently no scheduled certification events.',
    contact: 'Share your details and we will notify you about the next application period.',
  },
} as const;

function ContactLink({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Link className={styles.button} href={`/${locale}/contacto`}>{children}</Link>;
}

export default function AcademyLanding({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <div className={styles.page} data-academy-page>
      <section className={styles.hero} aria-labelledby="academy-title">
        <Image src={images.hero} alt={c.hero.alt} fill priority unoptimized sizes="100vw" />
        <div className={styles.heroPanel}>
          <p className={styles.eyebrow}>{c.hero.badge}</p>
          <h1 id="academy-title">{c.hero.title}</h1>
          <p>{c.hero.body}</p>
          <Link className={styles.button} href={`/${locale}/conoce-sigue`}>{c.hero.cta}</Link>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="academy-intro-title">
        <div className={styles.introImage}><Image src={images.intro} alt={c.intro.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 45vw" /></div>
        <div className={styles.introBody}>
          <h2 id="academy-intro-title">{c.intro.title}</h2>
          <p>{c.intro.body}</p>
          <ContactLink locale={locale}>{c.intro.cta}</ContactLink>
        </div>
      </section>

      <section className={styles.questions} aria-labelledby="academy-questions-title">
        <h2 id="academy-questions-title">{c.questionsTitle}</h2>
        <p className={styles.questionsIntro}>{c.questionsIntro}</p>
        <div className={styles.questionGrid}>
          {c.questions.map((question, index) => (
            <article key={question}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{question}</p></article>
          ))}
        </div>
        <p className={styles.questionsClosing}>{c.questionsClosing}</p>
        <ContactLink locale={locale}>{c.questionsCta}</ContactLink>
      </section>

      <section className={styles.why} aria-labelledby="academy-why-title">
        <h2 id="academy-why-title">{c.why.title}</h2>
        <p>{c.why.body}</p>
        <ContactLink locale={locale}>{c.why.cta}</ContactLink>
      </section>

      <section className={styles.certified} aria-labelledby="academy-certified-title">
        <h2 id="academy-certified-title">{c.certified.title}</h2>
        <p>{c.certified.body}</p>
      </section>

      <section className={styles.outcomes} aria-labelledby="academy-outcomes-title">
        <h2 id="academy-outcomes-title">{c.outcomesTitle}</h2>
        <div className={styles.outcomeGrid}>
          {c.outcomes.map(([title, body], index) => (
            <article className={index === c.outcomes.length - 1 ? styles.outcomeWide : undefined} key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <ContactLink locale={locale}>{c.apply}</ContactLink>
      </section>

      <aside className={styles.events} aria-label={c.noEvents}>
        <strong>{c.noEvents}</strong>
      </aside>

    </div>
  );
}
