import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgePercent,
  BookOpen,
  CheckCircle2,
  Handshake,
  LifeBuoy,
  TrendingUp,
} from 'lucide-react';
import styles from './MembershipLanding.module.css';

type Locale = 'es' | 'en';
type LocalizedText = readonly [spanish: string, english: string];

const heroImage = 'https://siguenetwork.org/wp-content/uploads/2024/11/banner_siguenetwork_mebresia.jpg';
const membershipForm = 'https://docs.google.com/forms/d/e/1FAIpQLSf22j0OHyaerFaAWZisk0QEmiT1wGJEXD_KZx2izujeFPRUtg/viewform';
const volunteerForm = 'https://docs.google.com/forms/d/1JYUumNnWCHKOCYZGvCZX-tko3UowVio2nHweL41Us2o/viewform?edit_requested=true';
const prayerForm = 'https://docs.google.com/forms/d/e/1FAIpQLSdj0gs75NwmuRb0qQdSrdZ4Y2SwQRdroBd5XxS7QtN960SR7w/viewform';

const memberLogoFiles = [1, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16, 19, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  .map((number) => `/images/cumbre-2026/member-logos/member-${String(number).padStart(2, '0')}.png`);

const questions: readonly { question: LocalizedText; answer: LocalizedText }[] = [
  {
    question: ['¿Buscas recursos especializados para expandir tu proyecto social?', 'Are you looking for specialized resources to expand your social project?'],
    answer: ['Accede a webinars y materiales exclusivos para optimizar tu proyecto social y aumentar tu impacto.', 'Access exclusive webinars and resources to strengthen your project and increase its impact.'],
  },
  {
    question: ['¿Quieres unirte a una comunidad de líderes en transformación integral?', 'Do you want to join a community of holistic-transformation leaders?'],
    answer: ['Conéctate con personas y organizaciones que comparten tus valores, oran juntas y colaboran en proyectos.', 'Connect with people and organizations that share your values, pray together, and collaborate on projects.'],
  },
  {
    question: ['¿Necesitas levantar fondos para tu proyecto?', 'Do you need to raise funds for your project?'],
    answer: ['Fortalece tu organización mediante la Certificación SIGUE y prepárate para conectar con oportunidades de financiamiento.', 'Strengthen your organization through SIGUE Certification and prepare to connect with funding opportunities.'],
  },
  {
    question: ['¿Deseas mayor visibilidad para tu proyecto?', 'Do you want greater visibility for your project?'],
    answer: ['Promociona tu trabajo y establece alianzas estratégicas que amplíen tu impacto.', 'Promote your work and build strategic partnerships that expand your impact.'],
  },
  {
    question: ['¿Te interesa la formación continua?', 'Are you interested in ongoing training?'],
    answer: ['Recibe beneficios exclusivos en eventos, talleres y certificaciones para fortalecer tu organización.', 'Receive exclusive benefits for events, workshops, and certifications that strengthen your organization.'],
  },
  {
    question: ['¿Buscas soporte personalizado?', 'Are you looking for personalized support?'],
    answer: ['Obtén mentoría, asesoría y asistencia técnica de expertos en nonprofits, gestión de proyectos, sostenibilidad e impacto.', 'Receive mentoring, consulting, and technical assistance from experts in nonprofits, project management, sustainability, and impact.'],
  },
];

const benefits = [
  {
    icon: BookOpen,
    title: ['Recursos exclusivos', 'Exclusive resources'] as LocalizedText,
    body: ['Accede a webinars, guías y herramientas que optimizan tu gestión y maximizan tu impacto.', 'Access webinars, guides, and tools that improve your management and maximize your impact.'] as LocalizedText,
  },
  {
    icon: BadgePercent,
    title: ['Beneficios especiales', 'Special benefits'] as LocalizedText,
    body: ['Obtén condiciones preferenciales en certificación, eventos, talleres y servicios de fortalecimiento.', 'Receive preferred access to certification, events, workshops, and capacity-building services.'] as LocalizedText,
  },
  {
    icon: Handshake,
    title: ['Conexiones estratégicas', 'Strategic connections'] as LocalizedText,
    body: ['Crea alianzas y colabora con líderes y organizaciones que comparten tu propósito.', 'Build partnerships and collaborate with leaders and organizations that share your purpose.'] as LocalizedText,
  },
  {
    icon: TrendingUp,
    title: ['Visibilidad ampliada', 'Expanded visibility'] as LocalizedText,
    body: ['Presenta tu proyecto y conéctate con aliados que pueden ampliar su alcance.', 'Showcase your project and connect with partners who can expand its reach.'] as LocalizedText,
  },
  {
    icon: LifeBuoy,
    title: ['Soporte continuo', 'Ongoing support'] as LocalizedText,
    body: ['Recibe mentoría y asistencia técnica para fortalecer las áreas clave de tu organización.', 'Receive mentoring and technical assistance to strengthen key areas of your organization.'] as LocalizedText,
  },
] as const;

const participationCards = [
  { title: ['Apoya nuestra misión', 'Support our mission'] as LocalizedText, body: ['Tu apoyo nos fortalece para llegar más lejos.', 'Your support helps us go further.'] as LocalizedText, path: '/contacto' },
  { title: ['Dona para transformar comunidades', 'Donate to transform communities'] as LocalizedText, body: ['Cada donación contribuye a cambiar vidas.', 'Every donation helps change lives.'] as LocalizedText, path: '/donacion' },
  { title: ['Patrocina SIGUE Academy', 'Sponsor SIGUE Academy'] as LocalizedText, body: ['Ayuda a formar líderes transformadores.', 'Help develop transformational leaders.'] as LocalizedText, path: '/sigue-academy' },
  { title: ['Auspicia la Cumbre SIGUE', 'Sponsor the SIGUE Summit'] as LocalizedText, body: ['Haz posible un evento de impacto.', 'Help make an impactful event possible.'] as LocalizedText, path: '/cumbre-sigue-2026' },
] as const;

const copy = {
  es: {
    heroBadge: 'MEMBRESÍA SIGUE',
    heroTitle: 'Membresía SIGUE Network: Unidos para expandir tu propósito',
    heroBody: 'Recursos, conexiones y apoyo para llevar transformación integral a cada comunidad.',
    heroCta: 'Descúbrelo aquí',
    heroAlt: 'Manos unidas que representan la comunidad SIGUE Network',
    questionsTitle: '¿Es la membresía de SIGUE Network para ti?',
    yes: 'Sí',
    ctaLead: 'Si dijiste SÍ a alguna de las preguntas anteriores, entonces',
    ctaTitle: 'Únete a SIGUE Network y transforma comunidades',
    cta: 'QUIERO SER MIEMBRO',
    membersEyebrow: 'CONOCE A NUESTROS MIEMBROS',
    membersTitle: 'Una red que transforma comunidades',
    membersBody: 'Nuestros miembros son líderes y organizaciones comprometidos con la transformación física, emocional y espiritual. Juntos compartimos recursos, aprendizajes y conexiones para multiplicar el impacto.',
    benefitsTitle: '¿Qué beneficios obtienes al hacerte miembro?',
    benefitsSubtitle: 'Recursos, conexiones, acompañamiento y crecimiento',
    contactLead: '¿Quieres conocer más detalles de los beneficios de SIGUE Network?',
    contactCta: 'CONVERSEMOS',
    movementTitle: 'Únete a SIGUE Network y sé parte de un movimiento de transformación integral.',
    movementBody: 'Si lideras una ONG, un proyecto social, formas parte de un equipo de acción social o eres una persona comprometida con transformar comunidades desde principios cristianos, este es tu lugar.',
    movementPrompt: 'Aquí unimos fuerzas para generar impacto integral',
    prayerTitle: 'Únete al círculo de oración',
    prayerBody: '52 semanas de oración por la transformación integral.',
    volunteerTitle: 'Únete a los voluntarios',
    volunteerBody: 'Usa tus talentos para servir y transformar.',
    membershipTitle: 'Suscríbete a la membresía de SIGUE Network',
    membershipBody: 'Sé parte de una red que impulsa el cambio integral.',
  },
  en: {
    heroBadge: 'SIGUE MEMBERSHIP',
    heroTitle: 'SIGUE Network Membership: United to expand your purpose',
    heroBody: 'Resources, connections, and support to bring holistic transformation to every community.',
    heroCta: 'Find out here',
    heroAlt: 'Hands joined together representing the SIGUE Network community',
    questionsTitle: 'Is SIGUE Network membership right for you?',
    yes: 'Yes',
    ctaLead: 'If you answered YES to any of the questions above, then',
    ctaTitle: 'Join SIGUE Network and transform communities',
    cta: 'BECOME A MEMBER',
    membersEyebrow: 'MEET OUR MEMBERS',
    membersTitle: 'A network transforming communities',
    membersBody: 'Our members are leaders and organizations committed to physical, emotional, and spiritual transformation. Together, we share resources, learning, and connections to multiply impact.',
    benefitsTitle: 'What benefits do you receive as a member?',
    benefitsSubtitle: 'Resources, connections, support, and growth',
    contactLead: 'Would you like to learn more about SIGUE Network membership benefits?',
    contactCta: 'LET’S TALK',
    movementTitle: 'Join SIGUE Network and become part of a holistic-transformation movement.',
    movementBody: 'If you lead an NGO or social project, serve on a church social-action team, or simply feel committed to transforming communities through Christian principles, this is your place.',
    movementPrompt: 'Here, we join forces to create holistic impact',
    prayerTitle: 'Join the prayer circle',
    prayerBody: '52 weeks of prayer for holistic transformation.',
    volunteerTitle: 'Join our volunteers',
    volunteerBody: 'Use your talents to serve and transform.',
    membershipTitle: 'Subscribe to SIGUE Network membership',
    membershipBody: 'Become part of a network that advances holistic change.',
  },
} as const;

function localized(text: LocalizedText, locale: Locale) {
  return text[locale === 'es' ? 0 : 1];
}

export default function MembershipLanding({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className={styles.page} data-membership-page>
      <section className={styles.hero} aria-labelledby="membership-title">
        <Image src={heroImage} alt={c.heroAlt} fill priority unoptimized sizes="100vw" />
        <div className={styles.heroPanel}>
          <span>{c.heroBadge}</span>
          <div>
            <h1 id="membership-title">{c.heroTitle}</h1>
            <p>{c.heroBody}</p>
            <a className={styles.button} href="#membresia-para-ti">{c.heroCta}</a>
          </div>
        </div>
      </section>

      <section id="membresia-para-ti" className={styles.questions} aria-labelledby="membership-questions-title">
        <h2 id="membership-questions-title">{c.questionsTitle}</h2>
        <div className={styles.questionGrid}>
          {questions.map((item) => (
            <article key={item.question[0]}>
              <h3><CheckCircle2 aria-hidden="true" />{localized(item.question, locale)}</h3>
              <p><strong>{c.yes} →</strong> {localized(item.answer, locale)}</p>
            </article>
          ))}
        </div>
        <div className={styles.membershipCta}>
          <p>{c.ctaLead}</p>
          <h2>{c.ctaTitle}</h2>
          <a className={styles.button} href={membershipForm} target="_blank" rel="noreferrer">{c.cta}</a>
        </div>
      </section>

      <section className={styles.members} aria-labelledby="members-title">
        <p className={styles.eyebrow}>{c.membersEyebrow}</p>
        <h2 id="members-title">{c.membersTitle}</h2>
        <div className={styles.logoViewport}>
          <div className={styles.logoTrack}>
            {[...memberLogoFiles, ...memberLogoFiles].map((logo, index) => (
              <div className={styles.logoCard} key={`${logo}-${index}`} aria-hidden={index >= memberLogoFiles.length}>
                <Image src={logo} alt={index < memberLogoFiles.length ? `SIGUE Network member ${index + 1}` : ''} fill sizes="180px" />
              </div>
            ))}
          </div>
        </div>
        <p className={styles.membersBody}>{c.membersBody}</p>
      </section>

      <section className={styles.benefits} aria-labelledby="benefits-title">
        <h2 id="benefits-title">{c.benefitsTitle}</h2>
        <p className={styles.sectionSubtitle}>{c.benefitsSubtitle}</p>
        <div className={styles.benefitGrid}>
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article key={benefit.title[0]}>
                <Icon aria-hidden="true" />
                <h3>{localized(benefit.title, locale)}</h3>
                <p>{localized(benefit.body, locale)}</p>
              </article>
            );
          })}
        </div>
        <p className={styles.contactLead}>{c.contactLead}</p>
        <Link className={styles.button} href={`/${locale}/contacto`}>{c.contactCta}</Link>
      </section>

      <section className={styles.movement} aria-labelledby="movement-title">
        <h2 id="movement-title">{c.movementTitle}</h2>
        <p>{c.movementBody}</p>
        <strong>{c.movementPrompt}</strong>
        <div className={styles.participationGrid}>
          {participationCards.map((card) => (
            <Link href={`/${locale}${card.path}`} key={card.title[0]}>
              <h3>{localized(card.title, locale)}</h3>
              <p>{localized(card.body, locale)}</p>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
          <a href={prayerForm} target="_blank" rel="noreferrer">
            <h3>{c.prayerTitle}</h3><p>{c.prayerBody}</p><ArrowRight aria-hidden="true" />
          </a>
          <a href={volunteerForm} target="_blank" rel="noreferrer">
            <h3>{c.volunteerTitle}</h3><p>{c.volunteerBody}</p><ArrowRight aria-hidden="true" />
          </a>
          <a className={styles.membershipCard} href={membershipForm} target="_blank" rel="noreferrer">
            <h3>{c.membershipTitle}</h3><p>{c.membershipBody}</p><ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
