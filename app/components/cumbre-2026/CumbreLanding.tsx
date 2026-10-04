import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../ui/Reveal';
import RegistrationForm from './RegistrationForm';
import { RegistrationCta, RegistrationProvider } from './RegistrationControls';
import { dayPass, tariffs } from './registration';
import UsdEquivalents from './UsdEquivalents';
import styles from './CumbreLanding.module.css';

const asset = '/images/cumbre-2026';
const memberLogoFiles = [1, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16, 19, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31].map(
  (number) => `${asset}/member-logos/member-${String(number).padStart(2, '0')}.png`
);
export type CumbreLocale = 'es' | 'en';
type LocalizedText = readonly [spanish: string, english: string];

const guests: {
  name: string;
  image: string;
  role: LocalizedText;
  organization?: string | LocalizedText;
  initiatives?: string[];
  country: LocalizedText;
  flag: string;
}[] = [
  {
    name: 'Mike y Lorena Bunster',
    image: 'mike-lorena',
    role: ['Fundadores', 'Founders'],
    initiatives: ['Alas de Refugio'],
    country: ['Chile', 'Chile'],
    flag: 'cl',
  },
  {
    name: 'Sandra B. Prieto',
    image: 'sandra-prieto',
    role: ['Fundadora y CEO', 'Founder and CEO'],
    organization: 'SIGUE Network',
    country: ['Estados Unidos', 'United States'],
    flag: 'us',
  },
  {
    name: 'Jorge H. Mejía',
    image: 'jorge-mejia',
    role: ['Director Sigue Fellows', 'Sigue Fellows Director'],
    organization: 'SIGUE Network',
    country: ['Colombia', 'Colombia'],
    flag: 'co',
  },
  {
    name: 'Jack Benjamin',
    image: 'jack-benjamin',
    role: ['Fundador', 'Founder'],
    organization: 'Global Enterprise Network (GEN)',
    country: ['Estados Unidos', 'United States'],
    flag: 'us',
  },
  {
    name: 'Marcela Erazo',
    image: 'marcela-erazo',
    role: ['Gerente General', 'General Manager'],
    organization: 'Génesis Ingeniería y Medio Ambiente SAS',
    country: ['Colombia', 'Colombia'],
    flag: 'co',
  },
  {
    name: 'Mark Petersen',
    image: 'mark-petersen',
    role: ['Fundador y CEO', 'Founder and CEO'],
    organization: 'Stronger Philanthropy',
    country: ['Canadá', 'Canada'],
    flag: 'ca',
  },
  {
    name: 'Henry M Pabón',
    image: 'henry-pabon',
    role: ['Pastor de niños y adolescentes', 'Children and youth pastor'],
    organization: [
      'Director del programa de Apoyo Social Iglesia El Lugar de Su Presencia',
      'Director of the Social Support Program at El Lugar de Su Presencia Church',
    ],
    country: ['Colombia', 'Colombia'],
    flag: 'co',
  },
  {
    name: 'Eker Machado Ariza',
    image: 'eker-machado',
    role: ['Secretario General y Director Jurídico', 'Secretary General and Legal Director'],
    organization: 'Fundación Santo Domingo',
    country: ['Colombia', 'Colombia'],
    flag: 'co',
  },
];

const experienceItems: LocalizedText[] = [
  ['Conversaciones inspiradoras', 'Inspiring conversations'],
  ['Mesas de escucha', 'Listening tables'],
  ['Laboratorios SIGUE', 'SIGUE Labs'],
  ['Clínica de casos', 'Case clinic'],
  ['Plaza SIGUE', 'SIGUE Marketplace'],
  ['Networking intencional', 'Intentional networking'],
  ['Showcase SIGUE Fellows™', 'SIGUE Fellows™ Showcase'],
  ['Historias de impacto', 'Impact stories'],
  ['Adoración y ministración', 'Worship and ministry'],
  ['Premio SIGUE Network', 'SIGUE Network Award'],
  ['Graduación Fellows', 'Fellows graduation'],
  ['Ceremonia de envío', 'Commissioning ceremony'],
];

const connectMethod = [
  {
    letter: 'C',
    title: ['Conecta', 'Connect'] as LocalizedText,
    body: [
      'Construye relaciones con organizaciones, iglesias, profesionales, donantes y aliados comprometidos con el impacto.',
      'Build relationships with organizations, churches, professionals, donors, and partners committed to impact.',
    ] as LocalizedText,
  },
  {
    letter: 'O',
    title: ['Orienta', 'Orient'] as LocalizedText,
    body: [
      'Comprende mejor las necesidades, los desafíos y las oportunidades presentes en las comunidades.',
      'Better understand the needs, challenges, and opportunities present in communities.',
    ] as LocalizedText,
  },
  {
    letter: 'N',
    title: ['Nutre', 'Nurture'] as LocalizedText,
    body: [
      'Recibe herramientas prácticas y recursos para fortalecer tu servicio y ampliar tu impacto.',
      'Receive practical tools and resources to strengthen your service and expand your impact.',
    ] as LocalizedText,
  },
  {
    letter: 'E',
    title: ['Escucha', 'Engage'] as LocalizedText,
    body: [
      'Acércate a las realidades de las comunidades a través del Método de los Cinco Sentidos™ y de quienes trabajan junto a ellas.',
      'Engage with community realities through the Five Senses Method™ and those who work alongside them.',
    ] as LocalizedText,
  },
  {
    letter: 'C',
    title: ['Colabora', 'Collaborate'] as LocalizedText,
    body: [
      'Descubre oportunidades para unir capacidades, recursos y esfuerzos con otros actores.',
      'Discover opportunities to combine capabilities, resources, and efforts with others.',
    ] as LocalizedText,
  },
  {
    letter: 'T',
    title: ['Transforma', 'Transform'] as LocalizedText,
    body: [
      'Permite que los aprendizajes y testimonios renueven tu manera de servir y generar impacto.',
      'Let insights and testimonies renew the way you serve and create impact.',
    ] as LocalizedText,
  },
  {
    letter: 'A',
    title: ['Actúa', 'Act'] as LocalizedText,
    body: [
      'Convierte lo aprendido en decisiones y respuestas pertinentes para las personas y sus comunidades.',
      'Turn what you learn into relevant decisions and responses for people and their communities.',
    ] as LocalizedText,
  },
];

interface CumbreAudienceItem {
  target: LocalizedText;
  benefit: LocalizedText;
}

const cumbreAudiences: CumbreAudienceItem[] = [
  {
    target: [
      'Directores y líderes de organizaciones sociales cristianas — fundaciones, ONG y proyectos comunitarios—, así como pastores y líderes de acción social de iglesias.',
      'Directors and leaders of Christian social organizations — foundations, NGOs, and community projects —, as well as pastors and church social-action leaders.',
    ],
    benefit: [
      'Se llevarán herramientas prácticas, conexiones estratégicas y próximos pasos concretos para escuchar mejor a sus comunidades, comprender sus necesidades físicas, emocionales y espirituales, fortalecer sus organizaciones y traducir su misión en respuestas pertinentes, sostenibles y de mayor impacto.',
      'They will gain practical tools, strategic connections, and concrete next steps to better listen to their communities, understand their physical, emotional, and spiritual needs, strengthen their organizations, and translate their mission into relevant, sustainable, and high-impact responses.',
    ],
  },
  {
    target: [
      'Emprendedores, profesionales y líderes empresariales cristianos comprometidos con generar impacto social.',
      'Christian entrepreneurs, professionals, and business leaders committed to generating social impact.',
    ],
    benefit: [
      'Encontrarán ideas, conexiones y oportunidades para aplicar su talento y capacidad empresarial a desafíos reales, fortalecer modelos de negocio que combinen rentabilidad e impacto social y construir alianzas que beneficien a las comunidades.',
      'They will find ideas, connections, and opportunities to apply their talent and business capability to real challenges, strengthen business models that combine profitability and social impact, and build alliances that benefit communities.',
    ],
  },
  {
    target: [
      'Donantes y aliados estratégicos interesados en impulsar iniciativas cristianas de impacto social.',
      'Donors and strategic partners interested in driving Christian social impact initiatives.',
    ],
    benefit: [
      'Conocerán de primera mano a líderes e iniciativas cristianas que están transformando comunidades, comprenderán mejor sus desafíos y descubrirán oportunidades concretas para movilizar recursos y conexiones, construir alianzas estratégicas y ampliar el alcance de su impacto.',
      'They will meet first-hand Christian leaders and initiatives transforming communities, better understand their challenges, and discover concrete opportunities to mobilize resources and connections, build strategic alliances, and expand their impact.',
    ],
  },
];

const faithPractices: readonly [string, LocalizedText][] = [
  ['faith-adoracion.png', ['Adoración', 'Worship']],
  ['faith-oracion.png', ['Oración', 'Prayer']],
  ['faith-devocionales.png', ['Devocionales', 'Devotionals']],
  ['faith-ministracion.png', ['Ministración', 'Ministry']],
  ['faith-accion.png', ['Fe y acción', 'Faith in action']],
  ['faith-envio.png', ['Ceremonia de envío', 'Commissioning']],
];

const included: readonly [string, LocalizedText][] = [
  ['include-programacion.png', ['Programación completa', 'Full program']],
  ['include-almuerzos.png', ['Almuerzos', 'Lunches']],
  ['include-refrigerios.png', ['Refrigerios', 'Refreshments']],
  ['include-celebraciones.png', ['Cenas 27 y 28', 'Dinners on the 27th and 28th']],
  ['include-networking.png', ['Networking', 'Networking']],
  ['include-camiseta.png', ['Camiseta oficial', 'Official T-shirt']],
  ['include-libreta.png', ['Libreta y esfero', 'Notebook and pen']],
  ['include-experiencias.png', ['Experiencias espirituales', 'Spiritual experiences']],
  ['include-materiales.png', ['Materiales', 'Materials']],
  ['include-plaza.png', ['Plaza SIGUE', 'SIGUE Marketplace']],
  ['include-escarapela.png', ['Escarapela', 'Name badge']],
  ['include-certificado.png', ['Celebraciones especiales', 'Special celebrations']],
];

const faqs = [
  {
    question: ['¿Para asistir tengo que ser miembro de SIGUE?', 'Do I have to be a SIGUE member to attend?'] as LocalizedText,
    answer: ['No. Pero te invitamos a hacerte miembro y disfrutar de los beneficios de membresía.', 'No. However, we invite you to become a member and enjoy membership benefits.'] as LocalizedText,
  },
  {
    question: ['¿El hospedaje es obligatorio?', 'Is lodging required?'] as LocalizedText,
    answer: ['No. Pero hemos logrado una tarifa muy favorable para los participantes en el sitio del evento.', 'No. However, we have secured a very favorable rate for participants at the event venue.'] as LocalizedText,
  },
  {
    question: ['¿Cuántas noches y qué está incluido en el hospedaje?', 'How many nights are included and what does lodging include?'] as LocalizedText,
    answer: ['Incluye el hospedaje del 27 y 28 de octubre y los desayunos del 28 y 29 de octubre.', 'It includes lodging on October 27 and 28, plus breakfast on October 28 and 29.'] as LocalizedText,
  },
  {
    question: ['¿Las cenas, almuerzos y refrigerios están incluidas?', 'Are dinners, lunches, and refreshments included?'] as LocalizedText,
    answer: ['Sí, los refrigerios, almuerzos y cenas del 27 y 28 están incluidos en la inscripción a la Cumbre.', 'Yes. Refreshments, lunches, and dinners on October 27 and 28 are included with Summit registration.'] as LocalizedText,
  },
  {
    question: ['¿Cuándo comienza y termina?', 'When does it begin and end?'] as LocalizedText,
    answer: ['Del 27 en la tarde al 29 antes de la cena.', 'From the afternoon of October 27 until before dinner on October 29.'] as LocalizedText,
  },
  {
    question: ['¿Puedo transferir mi inscripción?', 'Can I transfer my registration?'] as LocalizedText,
    answer: ['Sí, puedes transferir tu cupo a otra persona hasta 7 días antes del evento escribiéndonos a info@siguenetwork.org.', 'Yes. You can transfer your spot to another person up to 7 days before the event by writing to info@siguenetwork.org.'] as LocalizedText,
  },
  {
    question: ['¿Cuál es la política de reembolso?', 'What is the refund policy?'] as LocalizedText,
    answer: ['Reembolso del 80% hasta 30 días antes del evento, 50% entre 30 y 15 días antes, y sin reembolso a partir de los 14 días previos a la Cumbre. En todos los casos puedes optar por transferir tu cupo en lugar de solicitar reembolso.', 'An 80% refund is available up to 30 days before the event, 50% between 30 and 15 days before, and no refund from 14 days before the Summit. In every case, you may transfer your spot instead of requesting a refund.'] as LocalizedText,
  },
];

const pricing = [
  {
    id: 'general' as const,
    name: ['Tarifa General', 'General Rate'] as LocalizedText,
    price: tariffs.general.pass,
    lodging: tariffs.general.lodging,
  },
  {
    id: 'early' as const,
    name: ['Early Bird', 'Early Bird'] as LocalizedText,
    price: tariffs.early.pass,
    lodging: tariffs.early.lodging,
    benefit: ['15% de beneficio', '15% savings'] as LocalizedText,
  },
  {
    id: 'member' as const,
    name: ['Miembro Activo SIGUE', 'Active SIGUE Member'] as LocalizedText,
    price: tariffs.member.pass,
    lodging: tariffs.member.lodging,
    benefit: ['22% de beneficio', '22% savings'] as LocalizedText,
  },
];

function HeartMark({ small = false }: { small?: boolean }) {
  return (
    <Image
      src={`${asset}/corazon.png`}
      alt=""
      width={small ? 64 : 112}
      height={small ? 64 : 112}
      className={small ? styles.heartSmall : styles.heart}
      unoptimized
    />
  );
}

function SectionHeading({
  eyebrow,
  children,
  centered = false,
}: {
  eyebrow: string;
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <Reveal
      className={`${styles.sectionHeading} ${centered ? styles.centered : ''}`}
      variant="fade-up"
      duration={0.55}
    >
      <p className={styles.eyebrow}>{eyebrow}</p>
      <div className={styles.headingLine}>
        <HeartMark small />
        <h2>{children}</h2>
      </div>
    </Reveal>
  );
}

export default function CumbreLanding({ locale = 'es' }: { locale?: CumbreLocale }) {
  const text = (spanish: string, english: string) => (locale === 'en' ? english : spanish);
  const localized = ([spanish, english]: LocalizedText) => text(spanish, english);
  const formatCop = (amount: number) => new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-CO').format(amount);

  return (
    <RegistrationProvider>
      <div className={styles.page} data-cumbre-page id="inicio">

        <main>
          <section className={styles.hero} aria-labelledby="cumbre-title">
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <p className={styles.heroKicker}>
                  {text('2a. Cumbre SIGUE Network 2026', '2nd SIGUE Network Summit 2026')}
                </p>
                <h1
                  id="cumbre-title"
                  aria-label={text('Cumbre SIGUE Network 2026', 'SIGUE Network Summit 2026')}
                >
                  {locale === 'en' ? (
                    <>
                      <strong>SIGUE</strong>
                      <span className={styles.englishNetwork}>Network</span>
                      <span className={styles.englishSummit}>Summit 2026</span>
                    </>
                  ) : (
                    <>
                      <span>Cumbre</span>
                      <strong>SIGUE</strong>
                      <span>Network</span>
                      <span>2026</span>
                    </>
                  )}
                </h1>
                <div className={styles.datePill}>
                  <span className={styles.calendarIcon} aria-hidden="true">
                    <Image
                      src={`${asset}/calendar.png`}
                      alt=""
                      width={44}
                      height={40}
                      unoptimized
                    />
                  </span>
                  <span>
                    <strong>{text('27 al 29 de octubre de 2026', 'October 27–29, 2026')}</strong>
                    {text('Bogotá, Colombia', 'Bogotá, Colombia')}
                  </span>
                </div>
              </div>

              <div className={styles.heroVisual}>
                <Image
                  src={`${asset}/hero.webp`}
                  alt={text('Comunidad SIGUE Network reunida', 'SIGUE Network community gathered together')}
                  width={1100}
                  height={619}
                  className={styles.heroImage}
                  priority
                  sizes="(max-width: 760px) 100vw, 54vw"
                />
                <p>{text('Unidos para servir, fuertes para impactar.', 'United to serve, stronger together for greater impact.')}</p>
              </div>
            </div>
          </section>

          <section className={styles.intro} id="cumbre">
            <div className={styles.contentGrid}>
              <div className={styles.introMark}>
                <h2>{text('Del corazón a la estrategia', 'From heart to strategy')}</h2>
                <HeartMark />
              </div>
              <div className={styles.introCopy}>
                <h3>{text('Escuchar para servir', 'Listen to serve')}</h3>
                <p>
                  {text(
                    'Una experiencia para líderes, organizaciones e iglesias que quieren aprender a escuchar mejor las necesidades de sus comunidades y responder con mayor pertinencia, excelencia y colaboración al llamado de expandir el Reino de Dios.',
                    'An experience for leaders, organizations, and churches that want to better understand the needs of their communities and respond with greater relevance, excellence, and collaboration to the call to expand the Kingdom of God.'
                  )}
                </p>
                <a className={styles.primaryButton} href="#inscripcion">
                  {text('Quiero participar', 'I want to participate')}
                </a>
                <small>{text('Cupos limitados. Opción con hospedaje disponible.', 'Limited spots. Lodging option available.')}</small>
              </div>
            </div>
          </section>

          <section className={styles.centralIdea}>
            <p className={styles.eyebrow}>{text('Idea central', 'Central idea')}</p>
            <HeartMark />
            <blockquote className={styles.scriptureQuote}>
              <span>
                {text(
                  '“Ciertamente he visto la opresión que sufre mi pueblo... Los he escuchado... y conozco bien sus penurias. Así que he descendido para librarlos...”',
                  '“I have indeed seen the oppression of my people... I have heard them... and I am well aware of their suffering. So I have come down to rescue them...”'
                )}
              </span>
              <cite>{text('Éxodo 3:7–8, NVI', 'Exodus 3:7–8, NIV')}</cite>
            </blockquote>
            <h2>{text('Del corazón a la estrategia', 'From heart to strategy')}</h2>
            <p>
              {text(
                'Tenemos un corazón para servir. Pero las buenas intenciones, por sí solas, no siempre producen las mejores respuestas. La transformación comienza cuando aprendemos a escuchar antes de actuar. Durante la Cumbre SIGUE Network 2026 exploraremos cómo comprender mejor las necesidades físicas, emocionales y espirituales de las comunidades para diseñar respuestas que realmente conecten con su realidad.',
                'We have a heart to serve. But good intentions alone do not always produce the best responses. Transformation begins when we learn to listen before we act. During the 2026 SIGUE Network Summit, we will explore how to better understand the physical, emotional, and spiritual needs of communities in order to design responses that truly connect with their reality.'
              )}
            </p>
            <blockquote>
              {text('Servir mejor comienza escuchando a Dios', 'Serving better begins by listening to God')}
              <strong>{text(' y escuchando a las personas.', ' and listening to people.')}</strong>
            </blockquote>
          </section>

          <section className={styles.faithSection}>
            <div className={styles.faithImageWrap}>
              <Image
                src={`${asset}/fundamento.webp`}
                alt={text('Participante de SIGUE en un momento de oración', 'SIGUE participant during a moment of prayer')}
                fill
                className={styles.coverImage}
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
            <div className={styles.faithCopy}>
              <p className={styles.eyebrow}>{text('Fundamento', 'Foundation')}</p>
              <h2>{text('Una Cumbre con fundamento de fe', 'A Summit grounded in faith')}</h2>
              <p>
                {text(
                  'Nuestra fe no es un componente adicional de la Cumbre; es el lugar desde donde entendemos el servicio, el liderazgo y la transformación. Creemos que Dios está obrando en personas, familias y comunidades, y somos llamados a escuchar Su dirección y participar activamente en la expansión de Su Reino.',
                  'Our faith is not an added component of the Summit; it is the foundation from which we understand service, leadership, and transformation. We believe God is at work in people, families, and communities, and we are called to listen to His direction and actively participate in the expansion of His Kingdom.'
                )}
              </p>
              <p>
                {text(
                  'Queremos ver organizaciones fortalecidas, pero también líderes cuyo servicio nazca de una vida que escucha a Dios, ama a las personas y responde con obediencia y excelencia.',
                  'We want to see stronger organizations, as well as leaders whose service flows from a life that listens to God, loves people, and responds with obedience and excellence.'
                )}
              </p>
              <div className={styles.faithPractices}>
                {faithPractices.map(([icon, practice]) => (
                  <span key={icon}>
                    <Image src={`${asset}/${icon}`} alt="" width={72} height={72} unoptimized />
                    {localized(practice)}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.faithClosing}>
              <HeartMark />
              <p className={styles.faithStatement}>
                {text('En ', 'At ')}<strong>SIGUE</strong>{' '}
                {text(
                  'entendemos la transformación integral como la expansión del Reino de Dios en las dimensiones física, emocional y espiritual, a través de las ',
                  'we understand integral transformation as the expansion of the Kingdom of God across physical, emotional, and spiritual dimensions through the '
                )}
                <strong>{text('4R: Restaurar, Reconciliar, Redimir y Restituir.', '4Rs: Restoration, Reconciliation, Redemption, and Restitution.')}</strong>
              </p>
            </div>
          </section>

          <section className={styles.sigueSection} id="sigue">
            <div className={styles.sigueAccent} aria-hidden="true">
              <span />
              <span />
            </div>
            <div className={styles.sigueContent}>
              <p className={styles.eyebrow}>{text('¿Quiénes somos?', 'Who are we?')}</p>
              <div className={styles.sigueStatement}>
                <Image src={`${asset}/logo-sigue.png`} alt="" width={62} height={74} unoptimized />
                <h2>{text('Transformamos comunidades fortaleciendo y conectando a quienes las sirven.', 'We transform communities by strengthening and connecting those who serve them.')}</h2>
              </div>
              <p>
                {text(
                  'SIGUE Network conecta y fortalece organizaciones sociales, iglesias, empresas sociales y líderes comprometidos con la transformación integral de personas y comunidades. Trabajamos para que puedan servir con mayor capacidad, evidencia, colaboración y sostenibilidad.',
                  'SIGUE Network connects and strengthens social organizations, churches, social enterprises, and leaders committed to the integral transformation of people and communities. We help them serve with greater capacity, evidence, collaboration, and sustainability.'
                )}
              </p>
              <div className={styles.siguePrograms}>
                {[
                  [
                    'sigue-consulting.png',
                    text('Acompañamiento estratégico para organizaciones y proyectos de impacto.', 'Strategic guidance for organizations and impact projects.'),
                  ],
                  [
                    'sigue-academy.png',
                    text('Formación práctica para fortalecer organizaciones y ampliar su impacto.', 'Practical training to strengthen organizations and expand their impact.'),
                  ],
                  [
                    'sigue-hub.png',
                    text('Comunidad, conexiones y oportunidades para ampliar tu impacto.', 'Community, connections, and opportunities to expand your impact.'),
                  ],
                  [
                    'sigue-fellows.png',
                    text('Aceleración para líderes y organizaciones que están listas para crecer.', 'Acceleration for leaders and organizations ready to grow.'),
                  ],
                ].map(([image, copy]) => (
                  <article key={image}>
                    <Image src={`${asset}/${image}`} alt="" width={116} height={94} unoptimized />
                    <p>{copy}</p>
                  </article>
                ))}
              </div>
              <Link className={styles.primaryButton} href={`/${locale}/conoce-sigue`}>
                {text('Conoce más sobre SIGUE', 'Learn more about SIGUE')}
              </Link>
            </div>
          </section>

          <section className={styles.communitySection}>
            <div className={styles.narrowContent}>
              <SectionHeading eyebrow={text('Comunidad', 'Community')}>
                {text('Una comunidad que ya está sirviendo', 'A community already serving')}
              </SectionHeading>
              <p>
                {text(
                  'Nuestros miembros representan organizaciones y proyectos que sirven a niñez, jóvenes, mujeres, familias y adultos mayores, trabajando en educación, defensa de la vida, prevención de abuso, empleabilidad, habilidades para la vida, misiones, desarrollo comunitario, liderazgo, bienestar y formación espiritual.',
                  'Our members represent organizations and projects serving children, youth, women, families, and older adults through education, protection of life, abuse prevention, employability, life skills, missions, community development, leadership, well-being, and spiritual formation.'
                )}
              </p>
            </div>
            <div className={styles.communityGallery}>
              <Image
                src={`${asset}/comunidad-1.webp`}
                alt={text('Proyecto comunitario sirviendo alimentos', 'Community project serving food')}
                width={500}
                height={664}
              />
              <Image
                src={`${asset}/comunidad-2.webp`}
                alt={text('Familias y niños reunidos en un proyecto comunitario', 'Families and children gathered at a community project')}
                width={900}
                height={414}
              />
              <Image
                src={`${asset}/comunidad-3.webp`}
                alt={text('Miembros de la comunidad SIGUE', 'Members of the SIGUE community')}
                width={500}
                height={664}
              />
            </div>
            <p className={styles.communityClose}>
              {text(
                'La Cumbre será un espacio para conocer organizaciones, compartir aprendizajes, descubrir oportunidades de colaboración y construir relaciones que continúen después del evento.',
                'The Summit will be a space to meet organizations, share insights, discover opportunities for collaboration, and build relationships that continue beyond the event.'
              )}
              <strong>
                {text(
                  'No todos hacemos lo mismo, pero unidos para servir, somos más fuertes para impactar.',
                  'We do not all do the same work, but united to serve, we are stronger to create impact.'
                )}
              </strong>
            </p>
            <div className={styles.memberLogos} aria-label={text('Organizaciones de nuestra comunidad', 'Organizations in our community')}>
              <div className={styles.memberLogoTrack}>
                {[false, true].map((duplicate) => (
                  <div
                    className={styles.memberLogoGroup}
                    aria-hidden={duplicate || undefined}
                    key={duplicate ? 'duplicate' : 'original'}
                  >
                    {memberLogoFiles.map((image, index) => (
                      <span className={styles.memberLogoItem} key={`${duplicate ? 'duplicate' : 'original'}-${image}`}>
                        <Image
                          src={image}
                          alt={duplicate ? '' : text(`Logo de organización miembro ${index + 1}`, `Member organization logo ${index + 1}`)}
                          width={240}
                          height={110}
                          unoptimized
                        />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <Link className={styles.primaryButton} href={`/${locale}/miembros-sigue`}>
              {text('Conoce a nuestra comunidad', 'Meet our community')}
            </Link>
          </section>

          <section className={styles.experienceSection} id="experiencia">
            <div className={styles.narrowContent}>
              <SectionHeading eyebrow={text('Una experiencia distinta', 'A different experience')}>
                {text('Una Cumbre diferente', 'A different Summit')}
              </SectionHeading>
              <p>
                {text(
                  'No queremos que vengas solamente a escuchar. Queremos que participes, converses, construyas y conectes.',
                  'We do not want you to come only to listen. We want you to participate, converse, build, and connect.'
                )}
              </p>
            </div>
            <div className={styles.experienceGrid}>
              {experienceItems.map((item) => (
                <span key={item[0]}>
                  <i aria-hidden="true" /> {localized(item)}
                </span>
              ))}
            </div>
            <div className={styles.methodSection}>
              <SectionHeading eyebrow={text('Qué vas a vivir', 'What you will experience')}>
                {text('Una experiencia guiada por el método ', 'An experience guided by the ')}
                <em>C.O.N.E.C.T.A.™</em>{locale === 'en' ? ' method' : ''}
              </SectionHeading>
              <div className={styles.methodGrid}>
                {connectMethod.map((item) => (
                  <article key={`${item.letter}-${item.title[0]}`}>
                    <span>{item.letter}</span>
                    <h3>{localized(item.title)}</h3>
                    <p>{localized(item.body)}</p>
                  </article>
                ))}
              </div>
              <p className={styles.swipeHint}>
                <span aria-hidden="true">←</span> {text('Desliza para ver más', 'Swipe to see more')}{' '}
                <span aria-hidden="true">→</span>
              </p>
              <a className={styles.primaryButton} href="#inscripcion">
                {text('Quiero participar', 'I want to participate')}
              </a>
            </div>
          </section>

          <section className={styles.speakersSection} id="invitados">
            <SectionHeading eyebrow={text('Voces de la Cumbre', 'Summit voices')} centered>
              {text('Invitados', 'Guests')}
            </SectionHeading>
            <p className={styles.centeredLead}>
              {text(
                'Voces con un corazón de servicio y experiencia en el impacto integral en comunidades de varios países, aquí para adorar, enseñar, aprender e inspirar. Más invitados, próximamente.',
                'Voices with a heart for service and experience in integral community impact across several countries, here to worship, teach, learn, and inspire. More guests coming soon.'
              )}
            </p>
            <div className={styles.speakersPanel}>
              <div className={styles.speakersGrid}>
                {guests.map((guest) => (
                  <article key={guest.image}>
                    <Image
                      src={`${asset}/guest-${guest.image}.webp`}
                      alt={guest.name}
                      width={250}
                      height={240}
                      className={styles.speakerImage}
                      sizes="250px"
                    />
                    <h3>{guest.name}</h3>
                    <p className={styles.speakerRole}>{localized(guest.role)}</p>
                    {guest.initiatives && (
                      <ul className={styles.speakerInitiatives}>
                        {guest.initiatives.map((initiative) => <li key={initiative}>· {initiative}</li>)}
                      </ul>
                    )}
                    {guest.organization && (
                      <p className={styles.speakerOrganization}>
                        {typeof guest.organization === 'string' ? guest.organization : localized(guest.organization)}
                      </p>
                    )}
                    <Image
                      src={`${asset}/flag-${guest.flag}.svg`}
                      alt={localized(guest.country)}
                      width={68}
                      height={46}
                      className={styles.speakerFlag}
                    />
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.agendaSection} id="agenda">
            <div className={styles.narrowContent}>
              <SectionHeading eyebrow={text('Recorrido', 'Journey')}>
                {text('Un recorrido de tres días', 'A three-day journey')}
              </SectionHeading>
              <p className={styles.agendaLead}>
                {text('De escuchar a responder: ', 'From listening to responding: ')}
                <strong>{text('así se vive la Cumbre.', 'this is the Summit experience.')}</strong>
              </p>
            </div>
            <div className={styles.agendaGrid}>
              {[
                {
                  day: text('Día 1 · Escuchar', 'Day 1 · Listen'),
                  date: text('27 de octubre · tarde', 'October 27 · afternoon'),
                  quote: text('“Toda transformación comienza aprendiendo a escuchar.”', '“Every transformation begins by learning to listen.”'),
                },
                {
                  day: text('Día 2 · Descubrir', 'Day 2 · Discover'),
                  date: text('28 de octubre', 'October 28'),
                  quote: text('“Escuchar mejor para comprender antes de actuar.”', '“Listen better to understand before acting.”'),
                },
                {
                  day: text('Día 3 · Responder', 'Day 3 · Respond'),
                  date: text('29 de octubre', 'October 29'),
                  quote: text('“Las mejores respuestas nacen de una escucha profunda.”', '“The best responses are born from deep listening.”'),
                },
              ].map((item) => (
                <article key={item.day}>
                  <p>{item.day}</p>
                  <h3>{item.date}</h3>
                  <blockquote>{item.quote}</blockquote>
                  <a href="#inscripcion">{text('Ver detalle', 'View details')}</a>
                </article>
              ))}
            </div>
            <a
              className={styles.primaryButton}
              href="/downloads/programa-inicial-cumbre-sigue-2026.pdf"
              download="PROGRAMA INICIAL CUMBRE SIGUE 2026-Del corazon a la estrategia.pdf"
            >
              {text('Ver agenda completa', 'View full schedule')}
            </a>
          </section>

          <section className={styles.audienceSection} id="para-quien">
            <div className={styles.audienceContent}>
              <div className={styles.audienceHeader}>
                <SectionHeading eyebrow={text('Está pensada para ti', 'Designed for you')}>
                  {text('¿Para quién es la Cumbre?', 'Who is the Summit for?')}
                </SectionHeading>
                <p className={styles.audienceSubtitle}>
                  {text(
                    'Es para quienes sirven y para quienes hacen posible que el servicio se multiplique',
                    'It is for those who serve and for those who make it possible for service to multiply'
                  )}
                </p>
              </div>

              <div className={styles.audienceContainer}>
                <div className={styles.audienceImageBg}>
                  <Image
                    src={`${asset}/participantes.webp`}
                    alt={text('Participantes de una experiencia SIGUE', 'Participants in a SIGUE experience')}
                    fill
                    className={styles.coverImage}
                    sizes="(max-width: 900px) 100vw, 55vw"
                  />
                </div>

                <div className={styles.audienceRows}>
                  {cumbreAudiences.map((item, idx) => (
                    <div key={idx} className={styles.audienceRowPair}>
                      <div className={styles.audienceTargetCard}>
                        <span className={styles.checkIconCircle} aria-hidden="true">
                          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 5.5L5.5 9.5L13.5 1.5" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <p>{localized(item.target)}</p>
                      </div>
                      <div className={styles.audienceBenefitCard}>
                        <p>{localized(item.benefit)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.audienceClosing}>
              <p>
                {text(
                  'Nos reuniremos para escuchar, descubrir y responder juntos, uniendo capacidades, recursos y esfuerzos para servir mejor y multiplicar el impacto.',
                  'We gather to listen, discover, and respond together—uniting abilities, resources, and efforts to serve better and multiply impact.'
                )}
              </p>
              <strong>
                {text('No necesitas ser miembro de SIGUE Network para participar.', 'You do not need to be a SIGUE Network member to participate.')}
              </strong>
            </div>
          </section>

          <section className={styles.includedSection}>
            <SectionHeading eyebrow={text('Tu inscripción incluye', 'Your registration includes')}>
              {text('Pase Cumbre', 'Summit Pass')}
            </SectionHeading>
            <div className={styles.includedGrid}>
              {included.map(([icon, item]) => (
                <span key={icon}>
                  <Image
                    src={`${asset}/${icon}`}
                    alt=""
                    width={68}
                    height={68}
                    className={styles.includedIcon}
                    unoptimized
                  />
                  {localized(item)}
                </span>
              ))}
            </div>
          </section>

          <section className={styles.pricingSection} id="tarifas">
            <div className={styles.pricingHeading}>
              <p className={styles.eyebrow}>{text('Tarifas', 'Rates')}</p>
              <h2>{text('Elige tu tarifa', 'Choose your rate')}</h2>
              <p>{text('Escoge la opción que mejor se ajuste a ti.', 'Choose the option that works best for you.')}</p>
              <strong>{text('Pases completos y una opción para asistir solo un día.', 'Full Summit passes and a one-day option.')}</strong>
            </div>
            <div className={styles.pricingGrid}>
              {pricing.map((price) => (
                <article
                  key={price.id}
                >
                  {price.benefit ? <span className={styles.benefit}>{localized(price.benefit)}</span> : null}
                  <p>{localized(price.name)}</p>
                  <h3>
                    <small>COP</small> ${formatCop(price.price)}
                  </h3>
                  <strong>
                    {text('Con hospedaje:', 'With lodging:')} COP ${formatCop(price.lodging)}
                  </strong>
                  <RegistrationCta passType="full" tariff={price.id} withLodging={false}>
                    {text('Elegir', 'Choose')} {localized(price.name).replace(text('Tarifa ', ' Rate'), '')}
                  </RegistrationCta>
                </article>
              ))}
            </div>
            <article className={styles.dayPassCard}>
              <div>
                <p>{text('¿Solo puedes asistir un día?', 'Can you attend for just one day?')}</p>
                <h3>{text('Pase por día', 'Day Pass')}</h3>
                <span>{text('Elige el 27 (tarde), 28 o 29 de octubre. Sin hospedaje.', 'Choose October 27 (afternoon), 28, or 29. Lodging not included.')}</span>
              </div>
              <div className={styles.dayPassPrice}>
                <strong>COP ${formatCop(dayPass.cop)}</strong>
                <span>{text('por persona y día · US$66 en Zeffy', 'per person, per day · US$66 on Zeffy')}</span>
                <RegistrationCta passType="day" withLodging={false}>
                  {text('Elegir pase diario', 'Choose Day Pass')}
                </RegistrationCta>
              </div>
            </article>
            <UsdEquivalents locale={locale} />
          </section>

          <section className={styles.lodgingSection}>
            <div className={styles.narrowContent}>
              <SectionHeading eyebrow={text('Hospedaje', 'Lodging')}>
                {text('¿Vienes de otra ciudad?', 'Traveling from another city?')}
              </SectionHeading>
            </div>
            <div className={styles.lodgingCard}>
              <div>
                <p>
                  {text('La modalidad ', 'The ')}
                  <strong>{text('Cumbre + Hospedaje', 'Summit + Lodging')}</strong>{' '}
                  {text('incluye:', 'option includes:')}
                </p>
                <ul>
                  <li>{text('Noche del 27 de octubre', 'Night of October 27')}</li>
                  <li>{text('Noche del 28 de octubre', 'Night of October 28')}</li>
                  <li>{text('Desayuno del 28 de octubre', 'Breakfast on October 28')}</li>
                  <li>{text('Desayuno del 29 de octubre', 'Breakfast on October 29')}</li>
                  <li>{text('Todo lo incluido en el Pase Cumbre', 'Everything included in the Summit Pass')}</li>
                </ul>
                <strong>{text('Cupos de hospedaje limitados.', 'Limited lodging availability.')}</strong>
                <RegistrationCta className={styles.primaryButton} passType="full" withLodging>
                  {text('Quiero mi cupo con hospedaje', 'I want a spot with lodging')}
                </RegistrationCta>
              </div>
              <Image
                src={`${asset}/aeropuerto.webp`}
                alt={text('Viajeros en un aeropuerto al atardecer', 'Travelers at an airport at sunset')}
                width={780}
                height={520}
                sizes="(max-width: 760px) 100vw, 48vw"
              />
            </div>
          </section>

          <section className={styles.memberSection}>
            <p className={styles.eyebrow}>{text('Comunidad SIGUE', 'SIGUE Community')}</p>
            <h2>{text('Ser parte de la comunidad tiene beneficios', 'Being part of the community has benefits')}</h2>
            <p>{text('Miembro activo SIGUE accede a la tarifa más favorable de toda la Cumbre.', 'Active SIGUE members receive the Summit’s best available rate.')}</p>
            <div className={styles.memberPrice}>
              <strong>{text('COP $449.000', 'COP $449,000')}</strong>
              <span>{text('Miembro Activo SIGUE', 'Active SIGUE Member')}</span>
            </div>
            <p>{text('Con hospedaje: COP $652.000', 'With lodging: COP $652,000')}</p>
            <RegistrationCta className={styles.lightButton} passType="full" tariff="member" withLodging={false}>
              {text('Soy miembro SIGUE — Inscribirme', 'I am a SIGUE member — Register')}
            </RegistrationCta>
          </section>

          <section className={styles.registrationSection} id="inscripcion">
            <div className={styles.narrowContent}>
              <SectionHeading eyebrow={text('Inscripción', 'Registration')}>
                {text('Inscríbete a la Cumbre', 'Register for the Summit')}
              </SectionHeading>
              <p className={styles.registrationLead}>
                {text('Elige tu pase y la forma de pago que más te convenga. ', 'Choose your pass and the payment method that works best for you. ')}
                <strong>{text('Paga con tarjeta o transfiere el valor exacto en pesos colombianos.', 'Pay by card or transfer the exact amount in Colombian pesos.')}</strong>
              </p>
            </div>
            <RegistrationForm locale={locale} />
          </section>

          <section className={styles.venueSection} id="ubicacion">
            <div className={styles.venueHeading}>
              <p className={styles.eyebrow}>{text('Lugar', 'Venue')}</p>
              <div>
                <HeartMark small />
                <h2>
                  CELAM
                  <strong>Bogotá, Colombia</strong>
                </h2>
              </div>
              <p>
                {text(
                  'Un entorno pensado para el encuentro, la conversación y la construcción de comunidad.',
                  'A setting designed for gathering, conversation, and building community.'
                )}
              </p>
            </div>
            <Image
              src={`${asset}/sede.webp`}
              alt={text('Sede del CELAM en Bogotá', 'CELAM venue in Bogotá')}
              width={1500}
              height={1000}
              className={styles.venueImage}
            />
            <a
              className={styles.primaryButton}
              href="https://www.google.com/maps/search/?api=1&query=CELAM%2C%20Carrera%2072%20%23169%2C%20Bogot%C3%A1"
              target="_blank"
              rel="noreferrer"
            >
              {text('Ver ubicación', 'View location')}
            </a>
            <iframe
              className={styles.mapFrame}
              title={text('Mapa de CELAM en Bogotá', 'Map of CELAM in Bogotá')}
              src="https://www.google.com/maps?q=CELAM%2C%20Cra.%2072%20%23169%2C%20Bogot%C3%A1%2C%20Colombia&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </section>

          <section className={styles.faqSection} id="faq">
            <SectionHeading eyebrow={text('Respuesta a tus inquietudes', 'Answers to your questions')}>
              {text('Preguntas frecuentes', 'Frequently asked questions')}
            </SectionHeading>
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <details key={faq.question[0]}>
                  <summary>{localized(faq.question)}</summary>
                  <p>{localized(faq.answer)}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.finalCta}>
            <Image
              src={`${asset}/impacto.webp`}
              alt={text('Servicio que transforma a las comunidades', 'Service that transforms communities')}
              fill
              sizes="100vw"
              className={styles.finalCtaImage}
            />
            <div className={styles.finalCtaContent}>
              <p>{text('Tu momento', 'Your moment')}</p>
              <h2>
                {text(
                  'Tu corazón transformado por Dios, te llevó a servir. Ahora lleva ese corazón a la estrategia.',
                  'Your heart, transformed by God, led you to serve. Now bring that heart into strategy.'
                )}
              </h2>
              <strong>{text('Cumbre SIGUE Network 2026', 'SIGUE Network Summit 2026')}</strong>
              <span>{text('27–29 de octubre · Bogotá', 'October 27–29 · Bogotá')}</span>
              <RegistrationCta className={styles.lightButton}>
                {text('Quiero ser parte', 'I want to be part of it')}
              </RegistrationCta>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerBrand}>
            <Image
              src={`${asset}/logo-sigue.png`}
              alt="SIGUE Network"
              width={90}
              height={108}
              unoptimized
            />
            <h2>SIGUE Network</h2>
            <p>
              {text(
                'Transformamos comunidades fortaleciendo a quienes las sirven. Una red de líderes cristianos en Latinoamérica.',
                'We transform communities by strengthening those who serve them. A network of Christian leaders across Latin America.'
              )}
            </p>
            <div className={styles.footerSocial} aria-label={text('Redes sociales de SIGUE Network', 'SIGUE Network social media')}>
              <a
                href="https://www.linkedin.com/company/sigue-network/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={text('SIGUE Network en LinkedIn', 'SIGUE Network on LinkedIn')}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5.2 3.3A2.2 2.2 0 1 1 5.2 7.7a2.2 2.2 0 0 1 0-4.4ZM3.3 9h3.8v12H3.3V9Zm6.1 0H13v1.64h.05c.5-.95 1.73-1.95 3.56-1.95 3.8 0 4.5 2.5 4.5 5.74V21h-3.8v-5.82c0-1.39-.02-3.18-1.94-3.18-1.95 0-2.25 1.51-2.25 3.08V21H9.4V9Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/siguenetwork/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={text('SIGUE Network en Instagram', 'SIGUE Network on Instagram')}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.35 2h9.3A5.36 5.36 0 0 1 22 7.35v9.3A5.36 5.36 0 0 1 16.65 22h-9.3A5.36 5.36 0 0 1 2 16.65v-9.3A5.36 5.36 0 0 1 7.35 2Zm-.17 2A3.18 3.18 0 0 0 4 7.18v9.64A3.18 3.18 0 0 0 7.18 20h9.64A3.18 3.18 0 0 0 20 16.82V7.18A3.18 3.18 0 0 0 16.82 4H7.18Zm9.82 1.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 6.7a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 2a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Z" />
                </svg>
              </a>
            </div>
          </div>
          <nav className={styles.footerLinks} aria-label={text('Navegación de la Cumbre', 'Summit navigation')}>
            <strong>{text('Navegación', 'Navigation')}</strong>
            <a href="#cumbre">{text('La Cumbre', 'The Summit')}</a>
            <a href="#experiencia">{text('Experiencia', 'Experience')}</a>
            <a href="#agenda">{text('Agenda', 'Schedule')}</a>
            <a href="#sigue">SIGUE</a>
            <a href="#tarifas">{text('Tarifas', 'Rates')}</a>
            <a href="#faq">FAQ</a>
          </nav>
          <nav className={styles.footerLinks} aria-label={text('Información de la Cumbre', 'Summit information')}>
            <strong>{text('La Cumbre', 'The Summit')}</strong>
            <a href="#inscripcion">{text('Inscríbete', 'Register')}</a>
            <a href="#ubicacion">{text('Ubicación', 'Location')}</a>
            <Link href={`/${locale}`}>SIGUE Network</Link>
          </nav>
        </footer>
      </div>
    </RegistrationProvider>
  );
}
