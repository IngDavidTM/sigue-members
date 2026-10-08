import Image from 'next/image';
import Link from 'next/link';
import styles from './HubLanding.module.css';

type Locale = 'es' | 'en';

const images = {
  hero: 'https://siguenetwork.org/wp-content/uploads/2024/11/sigue_hub_banner.jpg',
  events: 'https://siguenetwork.org/wp-content/uploads/2024/11/eventos_siguehub_siguenetwork.jpg',
  membership: 'https://siguenetwork.org/wp-content/uploads/2024/11/membresia_siguehub_siguenetwork.jpg',
  academy: 'https://siguenetwork.org/wp-content/uploads/2024/11/sigueacademy_siguehub_siguenetwork.jpg',
  resources: 'https://siguenetwork.org/wp-content/uploads/2024/11/recursos_siguehub_siguenetwork.jpg',
  blog: 'https://siguenetwork.org/wp-content/uploads/2024/11/blog_siguehub_siguenetwork.jpg',
  impact: 'https://siguenetwork.org/wp-content/uploads/2024/11/transformacion_siguehub_siguenetwork.jpg',
} as const;

const content = {
  es: {
    hero: {
      badge: 'SIGUE Hub',
      title: 'SIGUE Hub: tu centro de conexión y crecimiento',
      body: 'Recursos, inspiración y conexiones para líderes de impacto integral.',
      cta: 'Descarga nuestro último blog',
      alt: 'Comunidad de líderes conectados por SIGUE Hub',
    },
    sections: [
      {
        title: 'Eventos',
        question: '¿Quieres inspirarte y conectar para impulsar la transformación integral?',
        body: 'Nuestros eventos están diseñados para inspirar y conectar a líderes y organizaciones comprometidos con transformar comunidades de manera integral. Mediante conferencias, talleres y cumbres, fomentamos el aprendizaje y las alianzas estratégicas entre ONGs, empresas y equipos de acción social de iglesias, fortaleciendo proyectos de impacto físico, emocional y espiritual.',
        cta: 'Próximos eventos', path: '/eventos', image: images.events,
        alt: 'Conferencia de líderes y organizaciones',
      },
      {
        title: 'Membresía SIGUE',
        question: '¿Deseas llevar tu propósito al siguiente nivel y transformar comunidades?',
        body: 'La membresía en SIGUE Network te brinda acceso a recursos exclusivos, conexiones valiosas y orientación estratégica para líderes comprometidos con la transformación integral. Al unirte, formas parte de una red que fortalece el impacto físico, emocional y espiritual, y abre nuevas oportunidades para crecer y multiplicar el alcance de tu proyecto.',
        cta: 'Únete ahora', path: '/miembros-sigue', image: images.membership,
        alt: 'Reunión de miembros de SIGUE Network',
      },
      {
        title: 'SIGUE Academy',
        question: '¿Quieres llevar tu compromiso con la transformación integral al siguiente nivel?',
        body: 'SIGUE Academy es nuestro espacio de formación para líderes, ONGs, empresas y equipos de acción social comprometidos con la transformación integral. Ofrecemos cursos, talleres, una comunidad en línea y certificaciones con principios cristianos, diseñados para impulsar el crecimiento físico, emocional y espiritual.',
        cta: 'Empieza hoy', path: '/sigue-academy', image: images.academy,
        alt: 'Capacitación para líderes en SIGUE Academy',
      },
      {
        title: 'Herramientas y guías: recursos descargables',
        question: '¿Buscas recursos para fortalecer y hacer más efectivo tu proyecto u organización?',
        body: 'Accede a recursos y herramientas que apoyan proyectos sociales, ONGs, emprendimientos sociales y equipos de acción social de iglesias a transformar comunidades de manera integral. Encuentra guías prácticas e innovadoras que te ayudan a fortalecer tu capacidad de servicio y ampliar tu impacto.',
        cta: 'Descárgalos aquí', path: '/herramientas-y-guias', image: images.resources,
        alt: 'Herramientas digitales y guías descargables',
      },
      {
        title: 'Blog: artículos y noticias',
        question: '¿Quieres estar al tanto de las últimas tendencias y consejos para impulsar la transformación integral en proyectos sociales cristianos?',
        body: 'Mantente al día con las últimas tendencias, consejos prácticos y desarrollos en el campo de la transformación integral. Descubre cómo aplicar principios cristianos a proyectos sociales para lograr un impacto profundo, guiado por valores que transforman comunidades física, emocional y espiritualmente.',
        cta: 'Descarga aquí', path: '/blog', image: images.blog,
        alt: 'Artículos y noticias de SIGUE Network',
      },
      {
        title: 'Transformación integral en acción',
        question: 'Conoce a un miembro de nuestra red',
        body: 'Mujeres al Original promueve la transformación integral de mujeres, con énfasis en su bienestar físico, emocional y espiritual. Con sede en Guatemala, empodera a mujeres para que alcancen su máximo potencial y fomenta una cultura libre de violencia. Sus programas fortalecen la formación y la defensa de los derechos de las mujeres desde un enfoque comunitario.',
        cta: 'Conoce a nuestros miembros', path: '/miembros-sigue', image: images.impact,
        alt: 'Comunidad reunida en una conferencia de impacto social',
      },
    ],
  },
  en: {
    hero: {
      badge: 'SIGUE HUB',
      title: 'SIGUE Hub: your center for connection and growth',
      body: 'Resources, inspiration, and connections for holistic-impact leaders.',
      cta: 'Download our latest blog',
      alt: 'A community of leaders connected through SIGUE Hub',
    },
    sections: [
      {
        title: 'Events',
        question: 'Do you want to get inspired and connect to advance holistic transformation?',
        body: 'Our events inspire and connect leaders and organizations committed to transforming communities holistically. Through conferences, workshops, and summits, we foster learning and strategic partnerships among NGOs, businesses, and church social-action teams, strengthening projects with physical, emotional, and spiritual impact.',
        cta: 'Upcoming events', path: '/eventos', image: images.events,
        alt: 'Conference for leaders and organizations',
      },
      {
        title: 'SIGUE Membership',
        question: 'Do you want to take your purpose to the next level and transform communities?',
        body: 'SIGUE Network membership gives you access to exclusive resources, valuable connections, and strategic guidance for leaders committed to holistic transformation. By joining, you become part of a network that strengthens physical, emotional, and spiritual impact while opening new opportunities to grow and multiply your project’s reach.',
        cta: 'Join now', path: '/miembros-sigue', image: images.membership,
        alt: 'SIGUE Network members meeting together',
      },
      {
        title: 'SIGUE Academy',
        question: 'Do you want to take your commitment to holistic transformation to the next level?',
        body: 'SIGUE Academy is our training space for leaders, NGOs, businesses, and church social-action teams committed to holistic transformation. We offer courses, workshops, an online community, and Christian-based certifications designed to promote physical, emotional, and spiritual growth.',
        cta: 'Start today', path: '/sigue-academy', image: images.academy,
        alt: 'Leadership training at SIGUE Academy',
      },
      {
        title: 'Tools and guides: downloadable resources',
        question: 'Are you looking for resources to strengthen your project or organization and make it more effective?',
        body: 'Access resources and tools that support social projects, NGOs, social enterprises, and church social-action teams as they transform communities holistically. Find practical, innovative guides that help strengthen your capacity to serve and expand your impact.',
        cta: 'Download them here', path: '/herramientas-y-guias', image: images.resources,
        alt: 'Digital tools and downloadable guides',
      },
      {
        title: 'Blog: articles and news',
        question: 'Do you want to stay up to date on trends and advice for advancing holistic transformation in Christian social projects?',
        body: 'Stay current with the latest trends, practical tips, and developments in holistic transformation. Discover how to apply Christian principles to social projects for deep impact, guided by values that transform communities physically, emotionally, and spiritually.',
        cta: 'Read the blog', path: '/blog', image: images.blog,
        alt: 'SIGUE Network articles and news',
      },
      {
        title: 'Holistic transformation in action',
        question: 'Meet a member of our network',
        body: 'Mujeres al Original promotes the holistic transformation of women, focusing on their physical, emotional, and spiritual well-being. Based in Guatemala, it empowers women to reach their full potential and fosters a culture free from violence. Its programs strengthen women through education and advocacy from a community-based perspective.',
        cta: 'Meet our members', path: '/miembros-sigue', image: images.impact,
        alt: 'Community gathered at a social-impact conference',
      },
    ],
  },
} as const;

export default function HubLanding({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <div className={styles.page} data-sigue-hub-page>
      <section className={styles.hero} aria-labelledby="hub-title">
        <Image src={images.hero} alt={c.hero.alt} fill priority unoptimized sizes="100vw" />
        <div className={styles.heroPanel}>
          <span className={styles.heroBadge}>{c.hero.badge}</span>
          <div>
            <h1 id="hub-title">{c.hero.title}</h1>
            <p>{c.hero.body}</p>
            <Link className={styles.button} href={`/${locale}/blog`}>{c.hero.cta}</Link>
          </div>
        </div>
      </section>

      <div>
        {c.sections.map((section, index) => (
          <section
            className={`${styles.feature} ${index % 2 === 1 ? styles.reversed : ''}`}
            key={section.title}
            aria-labelledby={`hub-section-${index}`}
          >
            <div className={styles.featureInner}>
              <div className={styles.copy}>
                <h2 id={`hub-section-${index}`}>{section.title}</h2>
                <h3>{section.question}</h3>
                <p>{section.body}</p>
                <Link className={styles.button} href={`/${locale}${section.path}`}>{section.cta}</Link>
              </div>
              <div className={styles.imageFrame}>
                <Image src={section.image} alt={section.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 46vw" />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
