export type ToolsLocale = 'es' | 'en';

type Localized = Record<ToolsLocale, string>;

export type ToolAxis = {
  slug: string;
  name: Localized;
  color: string;
};

export type LibraryTool = {
  id: string;
  axis: ToolAxis['slug'];
  month: Localized;
  title: Localized;
  description: Localized;
  duration: Localized | null;
  seoTitle: Localized;
  seoDescription: Localized;
  file: string;
  preview: string;
};

export const toolAxes: ToolAxis[] = [
  { slug: 'servir', name: { es: 'Servir', en: 'Serve' }, color: '#ef1452' },
  { slug: 'impactar', name: { es: 'Impactar', en: 'Impact' }, color: '#5e17eb' },
  { slug: 'guiar', name: { es: 'Guiar', en: 'Guide' }, color: '#522078' },
  { slug: 'unir', name: { es: 'Unir', en: 'Unite' }, color: '#0f8b8d' },
  { slug: 'empoderar', name: { es: 'Empoderar', en: 'Empower' }, color: '#e8590c' },
  { slug: 'expandir', name: { es: 'Expandir', en: 'Expand' }, color: '#2f6fdf' },
  { slug: 'posicionamiento', name: { es: 'Posicionamiento', en: 'Positioning' }, color: '#b5179e' },
  { slug: 'marketing', name: { es: 'Marketing', en: 'Marketing' }, color: '#1d7a46' },
];

export const libraryTools: LibraryTool[] = [
  {
    id: 'perfil-de-poblacion',
    axis: 'servir',
    month: { es: 'Enero', en: 'January' },
    title: {
      es: 'Perfil de población + mapa rápido de necesidades',
      en: 'Population profile + quick needs map',
    },
    description: {
      es: 'Define a quién sirves, su realidad cotidiana y las tres barreras que les impiden avanzar. Ideal para el equipo directivo o el líder de programa.',
      en: 'Define who you serve, their daily reality, and the three barriers that hold them back. Ideal for leadership teams or program leads.',
    },
    duration: { es: '15–25 minutos', en: '15–25 minutes' },
    seoTitle: {
      es: 'Plantilla gratuita: perfil de población para ONGs',
      en: 'Free template: population profile for nonprofits',
    },
    seoDescription: {
      es: 'Descarga gratis la plantilla de SIGUE Network para definir la población que sirves y mapear sus necesidades en 1–2 páginas.',
      en: 'Download SIGUE Network’s free template to define the population you serve and map its needs in 1–2 pages.',
    },
    file: '/legacy-media/2026/04/ENERO-.docx',
    preview: '/herramientas/previews/servir.webp',
  },
  {
    id: 'impacto-en-una-pagina',
    axis: 'impactar',
    month: { es: 'Febrero', en: 'February' },
    title: {
      es: 'Impacto en 1 página',
      en: 'Impact on one page',
    },
    description: {
      es: 'Resume tu impacto con un problema, un dato, una historia, dos indicadores y un llamado a la acción. Útil para pitch, web, redes y reuniones con donantes.',
      en: 'Summarize your impact with a problem, a data point, a story, two KPIs, and a call to action. Useful for pitches, web, social media, and donor meetings.',
    },
    duration: { es: '20 minutos', en: '20 minutes' },
    seoTitle: {
      es: 'Plantilla gratuita: cómo mostrar el impacto de tu ONG',
      en: 'Free template: show your nonprofit’s impact',
    },
    seoDescription: {
      es: 'Comunica el impacto de tu organización en una página: problema, dato, historia, 2 KPIs y CTA. Plantilla gratuita de SIGUE Network.',
      en: 'Communicate your organization’s impact on one page: problem, data, story, 2 KPIs, and CTA. Free SIGUE Network template.',
    },
    file: '/legacy-media/2026/04/FEBRERO.docx',
    preview: '/herramientas/previews/impactar.webp',
  },
  {
    id: 'gobernanza-minima',
    axis: 'guiar',
    month: { es: 'Marzo', en: 'March' },
    title: {
      es: 'Kit de gobernanza mínima financiable',
      en: 'Minimum fundable governance kit',
    },
    description: {
      es: 'Checklist, agenda, acta y tablero de acuerdos para ordenar la gobernanza básica que piden financiadores y aliados.',
      en: 'A checklist, agenda, minutes, and decision tracker to set up the basic governance funders and partners expect.',
    },
    duration: { es: '30–45 minutos', en: '30–45 minutes' },
    seoTitle: {
      es: 'Kit gratuito de gobernanza para organizaciones sociales',
      en: 'Free governance kit for social organizations',
    },
    seoDescription: {
      es: 'Ordena la gobernanza de tu organización con un checklist, agenda, acta y tablero de acuerdos. Kit gratuito de SIGUE Network.',
      en: 'Organize your governance with a checklist, agenda, minutes, and decision tracker. Free SIGUE Network kit.',
    },
    file: '/legacy-media/2026/04/MARZO.docx',
    preview: '/herramientas/previews/guiar.webp',
  },
  {
    id: 'propuesta-de-alianza',
    axis: 'unir',
    month: { es: 'Abril', en: 'April' },
    title: {
      es: 'Propuesta de alianza en 1 página + piloto de 60–90 días',
      en: 'One-page partnership proposal + 60–90 day pilot',
    },
    description: {
      es: 'Prepara una propuesta clara y un piloto concreto antes de pedir una reunión con una empresa o un aliado.',
      en: 'Prepare a clear proposal and a concrete pilot before requesting a meeting with a company or partner.',
    },
    duration: { es: '20–30 minutos', en: '20–30 minutes' },
    seoTitle: {
      es: 'Plantilla gratuita: propuesta de alianza para ONGs',
      en: 'Free template: partnership proposal for nonprofits',
    },
    seoDescription: {
      es: 'Diseña una propuesta de alianza en una página y un piloto de 60–90 días para empresas y aliados. Plantilla gratuita.',
      en: 'Design a one-page partnership proposal and a 60–90 day pilot for companies and partners. Free template.',
    },
    file: '/legacy-media/2026/04/ABRIL.docx',
    preview: '/herramientas/previews/unir.webp',
  },
  {
    id: 'autoevaluacion-del-lider',
    axis: 'empoderar',
    month: { es: 'Mayo', en: 'May' },
    title: {
      es: 'Autoevaluación del líder sostenible',
      en: 'Sustainable leader self-assessment',
    },
    description: {
      es: 'Una reflexión personal para revisar tu energía, señales de alerta y hábitos, y liderar sin agotarte.',
      en: 'A personal reflection to review your energy, warning signs, and habits so you can lead without burning out.',
    },
    duration: { es: '10–15 minutos', en: '10–15 minutes' },
    seoTitle: {
      es: 'Autoevaluación gratuita para líderes sociales',
      en: 'Free self-assessment for social leaders',
    },
    seoDescription: {
      es: 'Evalúa tu energía, tus señales de alerta y tus hábitos como líder con esta herramienta gratuita de SIGUE Network.',
      en: 'Assess your energy, warning signs, and habits as a leader with this free SIGUE Network tool.',
    },
    file: '/legacy-media/2026/04/MAYO.docx',
    preview: '/herramientas/previews/empoderar.webp',
  },
  {
    id: 'disenador-de-piloto',
    axis: 'expandir',
    month: { es: 'Junio', en: 'June' },
    title: {
      es: 'Diseñador de piloto + checklist de replicabilidad',
      en: 'Pilot designer + replicability checklist',
    },
    description: {
      es: 'Define el objetivo, la duración y el alcance de un piloto, y revisa si tu programa está listo para replicarse.',
      en: 'Define a pilot’s goal, length, and scope, and check whether your program is ready to be replicated.',
    },
    duration: { es: '20–45 minutos', en: '20–45 minutes' },
    seoTitle: {
      es: 'Plantilla gratuita: diseña un piloto para tu proyecto',
      en: 'Free template: design a pilot for your project',
    },
    seoDescription: {
      es: 'Diseña un piloto y comprueba si tu programa puede escalar con esta plantilla y checklist gratuitos de SIGUE Network.',
      en: 'Design a pilot and check whether your program can scale with this free SIGUE Network template and checklist.',
    },
    file: '/herramientas/archivos/junio-expandir-disenador-de-piloto.docx',
    preview: '/herramientas/previews/expandir.webp',
  },
  {
    id: 'mensaje-central',
    axis: 'posicionamiento',
    month: { es: 'Julio', en: 'July' },
    title: {
      es: 'Mensaje central + propuesta de valor',
      en: 'Core message + value proposition',
    },
    description: {
      es: 'Construye en una frase qué haces, para quién y para qué, y conviértelo en una propuesta de valor para donantes y aliados.',
      en: 'Build one sentence on what you do, for whom, and why, and turn it into a value proposition for donors and partners.',
    },
    duration: { es: '15–40 minutos', en: '15–40 minutes' },
    seoTitle: {
      es: 'Plantilla gratuita: mensaje central de tu organización',
      en: 'Free template: your organization’s core message',
    },
    seoDescription: {
      es: 'Define el mensaje central y la propuesta de valor de tu organización social con esta plantilla gratuita de SIGUE Network.',
      en: 'Define your social organization’s core message and value proposition with this free SIGUE Network template.',
    },
    file: '/herramientas/archivos/julio-posicionamiento-mensaje-central.docx',
    preview: '/herramientas/previews/posicionamiento.webp',
  },
  {
    id: 'mapa-de-canales',
    axis: 'marketing',
    month: { es: 'Agosto', en: 'August' },
    title: {
      es: 'Mapa de canales + plan de 30 días',
      en: 'Channel map + 30-day plan',
    },
    description: {
      es: 'Elige hasta tres canales, define qué tipo de contenido publicarás y organiza tu comunicación del próximo mes.',
      en: 'Choose up to three channels, decide what kind of content you will share, and plan next month’s communication.',
    },
    duration: null,
    seoTitle: {
      es: 'Plantilla gratuita: plan de comunicación de 30 días',
      en: 'Free template: 30-day communication plan',
    },
    seoDescription: {
      es: 'Elige tus canales de comunicación y arma un plan de contenidos de 30 días con esta plantilla gratuita para ONGs.',
      en: 'Choose your communication channels and build a 30-day content plan with this free template for nonprofits.',
    },
    file: '/herramientas/archivos/agosto-marketing-mapa-de-canales.docx',
    preview: '/herramientas/previews/marketing.webp',
  },
];

export const otherGuides = [
  {
    es: 'Hoja de chequeo para evaluar los desafíos de FE de mi proyecto social o entidad sin ánimo de lucro',
    en: 'Checklist to assess the FE challenges of my social project or nonprofit organization',
    href: '/legacy-media/2024/11/Hoja-de-chequeo-para-evaluar-los-desafios-de-FE-de-mi-fundacion-ONG-o-proyecto-social.docx',
    type: 'DOCX',
  },
  {
    es: 'Hoja de trabajo para establecer una estrategia de transformación integral de comunidades',
    en: 'Worksheet for developing a comprehensive community-transformation strategy',
    href: '/legacy-media/2025/02/Plantilla-para-elaborar-estrategia-de-transformacion-FES-SIGUE-Network-2025.pdf',
    type: 'PDF',
  },
  {
    es: 'Política de tratamiento de datos personales',
    en: 'Personal data processing policy',
    href: '/legacy-media/2025/05/Herramienta_-politica-de-tratamiento-de-datos-personales.pdf',
    type: 'PDF',
  },
] as const;

export function getToolAxis(slug: string) {
  return toolAxes.find((axis) => axis.slug === slug) ?? null;
}

export function getToolsForAxis(slug: string | null) {
  return slug ? libraryTools.filter((tool) => tool.axis === slug) : libraryTools;
}
