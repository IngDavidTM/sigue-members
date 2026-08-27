export type SiteLocale = 'es' | 'en';

export type NavigationIconName =
  | 'about'
  | 'star'
  | 'transform'
  | 'impact'
  | 'team'
  | 'academy'
  | 'hub'
  | 'fellows'
  | 'consulting'
  | 'assessment'
  | 'membership'
  | 'benefits'
  | 'community'
  | 'join'
  | 'blog'
  | 'tools'
  | 'webinars'
  | 'events'
  | 'summit'
  | 'agenda'
  | 'speakers'
  | 'registration'
  | 'sponsors'
  | 'faq';

export type NavigationChild = {
  readonly label: string;
  readonly description?: string;
  readonly href?: string;
  readonly icon: NavigationIconName;
  readonly color: string;
};

export type NavigationItem = {
  readonly label: string;
  readonly href?: string;
  readonly accent?: boolean;
  readonly wide?: boolean;
  readonly topLink?: { readonly label: string; readonly href: string };
  readonly children?: readonly NavigationChild[];
};

export type NavigationContent = {
  readonly items: readonly NavigationItem[];
  readonly donate: string;
};

export const siteNavigation: Record<SiteLocale, NavigationContent> = {
  es: {
    donate: 'Donar',
    items: [
      { label: 'Inicio', href: '/' },
      {
        label: 'Conoce SIGUE',
        children: [
          { label: 'Nuestra historia', description: 'Cómo nació SIGUE Network', href: '/conoce-sigue#historia', icon: 'about', color: '#501f76' },
          { label: 'Misión y visión', description: 'Lo que nos mueve', href: '/conoce-sigue#esencia', icon: 'star', color: '#5e17eb' },
          { label: 'Transformación integral', description: 'Física, emocional y espiritual', href: '/conoce-sigue#corazon', icon: 'transform', color: '#b41ba1' },
          { label: 'Nuestro impacto', description: 'Resultados medibles', href: '/#impacto', icon: 'impact', color: '#e96596' },
          { label: 'Equipo', description: 'Las personas detrás de SIGUE', href: '/conoce-sigue#equipo', icon: 'team', color: '#ef1451' },
        ],
      },
      {
        label: 'Ecosistema',
        wide: true,
        children: [
          { label: 'SIGUE Academy™', description: 'Formación', href: '/sigue-academy', icon: 'academy', color: '#b41ba1' },
          { label: 'SIGUE Hub™', description: 'Comunidad y conexión', href: '/sigue-hub', icon: 'hub', color: '#5e17eb' },
          { label: 'SIGUE Fellows™', description: 'Aceleración', icon: 'fellows', color: '#ef1451' },
          { label: 'SIGUE Consulting', description: 'Asesoría especializada', href: '/sigue-consulting', icon: 'consulting', color: '#501f76' },
          { label: 'SIGUE Scale-Up™', description: 'Autoevaluación diagnóstica', href: '/sigue-tracks', icon: 'assessment', color: 'linear-gradient(135deg, #501f76, #5e17eb)' },
        ],
      },
      {
        label: 'Membresía',
        children: [
          { label: 'Conoce la membresía', description: 'Qué es y quiénes pueden unirse', href: '/unete', icon: 'membership', color: '#501f76' },
          { label: 'Beneficios', description: 'Lo que obtienes como miembro', icon: 'benefits', color: '#5e17eb' },
          { label: 'Nuestra comunidad', description: 'Conoce a los miembros', href: '/miembros-sigue', icon: 'community', color: '#b41ba1' },
          { label: 'Hazte miembro', description: 'Únete a la red SIGUE', href: '/unete', icon: 'join', color: '#ef1451' },
        ],
      },
      {
        label: 'Recursos',
        topLink: { label: 'Todos los recursos', href: '/recursos' },
        children: [
          { label: 'Blogs', description: 'Ideas prácticas para tu misión', href: '/blog', icon: 'blog', color: '#501f76' },
          { label: 'Herramientas prácticas', description: 'Plantillas, guías y matrices', href: '/herramientas-y-guias', icon: 'tools', color: '#5e17eb' },
          { label: 'Webinars', description: 'Sesiones grabadas por eje SIGUE', icon: 'webinars', color: '#b41ba1' },
          { label: 'Próximos eventos', description: 'Agenda de la Red SIGUE', href: '/eventos', icon: 'events', color: '#ef1451' },
        ],
      },
      {
        label: 'Cumbre 2026',
        accent: true,
        wide: true,
        children: [
          { label: 'Conoce la Cumbre', description: 'El evento anual de la Red SIGUE', href: '/cumbre-sigue-2026#cumbre', icon: 'summit', color: 'linear-gradient(135deg, #501f76, #ef1451)' },
          { label: 'Agenda', description: 'Programa completo del evento', href: '/cumbre-sigue-2026#agenda', icon: 'agenda', color: '#501f76' },
          { label: 'Invitados', description: 'Speakers y panelistas', href: '/cumbre-sigue-2026#invitados', icon: 'speakers', color: '#5e17eb' },
          { label: 'Inscripción', description: 'Reserva tu lugar', href: '/cumbre-sigue-2026#inscripcion', icon: 'registration', color: '#b41ba1' },
          { label: 'Patrocinios', description: 'Apoya y visibiliza tu marca', icon: 'sponsors', color: '#e96596' },
          { label: 'Preguntas frecuentes', description: 'Todo lo que necesitas saber', href: '/cumbre-sigue-2026#faq', icon: 'faq', color: '#ef1451' },
        ],
      },
    ],
  },
  en: {
    donate: 'Donate',
    items: [
      { label: 'Home', href: '/' },
      {
        label: 'About SIGUE',
        children: [
          { label: 'Our history', description: 'How SIGUE Network began', href: '/conoce-sigue#historia', icon: 'about', color: '#501f76' },
          { label: 'Mission and vision', description: 'What drives us', href: '/conoce-sigue#esencia', icon: 'star', color: '#5e17eb' },
          { label: 'Holistic transformation', description: 'Physical, emotional, and spiritual', href: '/conoce-sigue#corazon', icon: 'transform', color: '#b41ba1' },
          { label: 'Our impact', description: 'Measurable results', href: '/#impacto', icon: 'impact', color: '#e96596' },
          { label: 'Team', description: 'The people behind SIGUE', href: '/conoce-sigue#equipo', icon: 'team', color: '#ef1451' },
        ],
      },
      {
        label: 'Ecosystem',
        wide: true,
        children: [
          { label: 'SIGUE Academy™', description: 'Training', href: '/sigue-academy', icon: 'academy', color: '#b41ba1' },
          { label: 'SIGUE Hub™', description: 'Community and connection', href: '/sigue-hub', icon: 'hub', color: '#5e17eb' },
          { label: 'SIGUE Fellows™', description: 'Acceleration', icon: 'fellows', color: '#ef1451' },
          { label: 'SIGUE Consulting', description: 'Specialized consulting', href: '/sigue-consulting', icon: 'consulting', color: '#501f76' },
          { label: 'SIGUE Scale-Up™', description: 'Diagnostic self-assessment', href: '/sigue-tracks', icon: 'assessment', color: 'linear-gradient(135deg, #501f76, #5e17eb)' },
        ],
      },
      {
        label: 'Membership',
        children: [
          { label: 'Explore membership', description: 'What it is and who can join', href: '/unete', icon: 'membership', color: '#501f76' },
          { label: 'Benefits', description: 'What you receive as a member', icon: 'benefits', color: '#5e17eb' },
          { label: 'Our community', description: 'Meet our members', href: '/miembros-sigue', icon: 'community', color: '#b41ba1' },
          { label: 'Become a member', description: 'Join the SIGUE network', href: '/unete', icon: 'join', color: '#ef1451' },
        ],
      },
      {
        label: 'Resources',
        topLink: { label: 'All resources', href: '/recursos' },
        children: [
          { label: 'Blog', description: 'Practical ideas for your mission', href: '/blog', icon: 'blog', color: '#501f76' },
          { label: 'Practical tools', description: 'Templates, guides, and matrices', href: '/herramientas-y-guias', icon: 'tools', color: '#5e17eb' },
          { label: 'Webinars', description: 'Recorded sessions by SIGUE axis', icon: 'webinars', color: '#b41ba1' },
          { label: 'Upcoming events', description: 'SIGUE Network calendar', href: '/eventos', icon: 'events', color: '#ef1451' },
        ],
      },
      {
        label: 'Summit 2026',
        accent: true,
        wide: true,
        children: [
          { label: 'About the Summit', description: 'SIGUE Network’s annual event', href: '/cumbre-sigue-2026#cumbre', icon: 'summit', color: 'linear-gradient(135deg, #501f76, #ef1451)' },
          { label: 'Agenda', description: 'Full event program', href: '/cumbre-sigue-2026#agenda', icon: 'agenda', color: '#501f76' },
          { label: 'Guests', description: 'Speakers and panelists', href: '/cumbre-sigue-2026#invitados', icon: 'speakers', color: '#5e17eb' },
          { label: 'Registration', description: 'Reserve your place', href: '/cumbre-sigue-2026#inscripcion', icon: 'registration', color: '#b41ba1' },
          { label: 'Sponsorships', description: 'Support the event and showcase your brand', icon: 'sponsors', color: '#e96596' },
          { label: 'Frequently asked questions', description: 'Everything you need to know', href: '/cumbre-sigue-2026#faq', icon: 'faq', color: '#ef1451' },
        ],
      },
    ],
  },
};

export function localizedNavigationHref(locale: SiteLocale, href: string) {
  if (href.startsWith('http') || href.startsWith('mailto:')) return href;
  if (href === '/') return `/${locale}`;
  return `/${locale}${href}`;
}
