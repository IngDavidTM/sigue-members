import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/site-url';

const details = {
  es: {
    title: 'Política de tratamiento de datos personales',
    intro: 'SIGUE Network trata los datos que nos entregas al registrarte, escribirnos, solicitar recursos, participar en eventos o expresar interés en nuestros programas.',
    sections: [
      ['Responsable y contacto', 'SIGUE Network · EIN 26-2010006 · 3913 Griese Lane, Grovetown, GA 30813, Estados Unidos. Para consultas y solicitudes sobre tus datos, escribe a info@siguenetwork.org.'],
      ['Datos que recibimos', 'Podemos recibir nombre, organización, correo, teléfono, ciudad o país, datos de cuenta y el contenido que envíes en formularios. También recibimos datos técnicos necesarios para proteger el sitio y prestar el servicio. Si pagas mediante un proveedor externo, el pago se procesa en su plataforma; SIGUE solo recibe la información que ese proveedor nos comunica para gestionar tu inscripción o donación.'],
      ['Para qué los usamos', 'Respondemos solicitudes, administramos cuentas, inscripciones y programas, entregamos recursos solicitados, enviamos comunicaciones cuando las aceptas, atendemos obligaciones aplicables y protegemos el sitio. No vendemos tus datos personales.'],
      ['Proveedores y transferencias', 'Utilizamos proveedores de alojamiento, base de datos, correo y seguridad, entre ellos Vercel, Supabase, Cloudflare y, cuando corresponda, proveedores de pagos o donaciones como Zeffy. Sus servicios pueden procesar datos fuera de tu país; limitamos el acceso a lo necesario para las finalidades indicadas.'],
      ['Conservación y seguridad', 'Conservamos los datos mientras sean necesarios para la finalidad por la que se recogieron y para obligaciones legales aplicables. Aplicamos controles de acceso y medidas técnicas razonables. Ninguna transmisión por Internet garantiza seguridad absoluta.'],
      ['Tus derechos', 'Puedes solicitar conocer, actualizar, corregir o eliminar tus datos y retirar autorizaciones cuando proceda. Envía tu solicitud a info@siguenetwork.org indicando cómo identificar tu registro. Podemos pedir información razonable para verificar tu identidad antes de responder.'],
      ['Actualizaciones', 'Publicaremos aquí los cambios a esta política e indicaremos su fecha de actualización.'],
    ],
    updated: 'Borrador actualizado el 8 de octubre de 2026. SIGUE Network debe confirmar los datos legales y los plazos internos antes de considerarlo texto definitivo.',
    home: 'Volver al inicio',
  },
  en: {
    title: 'Personal data and privacy policy',
    intro: 'SIGUE Network processes information you provide when you register, contact us, request resources, join events, or express interest in our programs.',
    sections: [
      ['Controller and contact', 'SIGUE Network · EIN 26-2010006 · 3913 Griese Lane, Grovetown, GA 30813, United States. For questions and requests about your data, email info@siguenetwork.org.'],
      ['Information we receive', 'We may receive your name, organization, email, phone, city or country, account details, and form responses. We also receive technical information needed to secure and operate the site. Payments made through an external provider are processed on its platform; SIGUE receives only the information that provider shares to manage your registration or donation.'],
      ['How we use information', 'We answer requests, manage accounts, registrations and programs, provide requested resources, send communications when you opt in, meet applicable obligations, and protect the site. We do not sell personal information.'],
      ['Service providers and transfers', 'We use hosting, database, email and security providers, including Vercel, Supabase and Cloudflare, and payment or donation providers such as Zeffy where relevant. These services may process data outside your country; access is limited to what is needed for the purposes above.'],
      ['Retention and security', 'We retain information while needed for the purpose for which it was collected and for applicable legal obligations. We use reasonable access controls and technical safeguards. No Internet transmission can be guaranteed completely secure.'],
      ['Your choices and rights', 'You may request access, correction or deletion of your information and withdraw consent where applicable. Email info@siguenetwork.org with enough detail to identify your record. We may ask for reasonable identity verification before responding.'],
      ['Updates', 'We will publish changes here and show the update date.'],
    ],
    updated: 'Draft updated October 8, 2026. SIGUE Network should confirm its legal details and internal retention periods before treating this as final.',
    home: 'Back to home',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  return {
    title: `${details[locale].title} | SIGUE Network`,
    description: details[locale].intro,
    alternates: {
      canonical: absoluteUrl(`/${locale}/politica-de-privacidad`),
      languages: { es: absoluteUrl('/es/politica-de-privacidad'), en: absoluteUrl('/en/politica-de-privacidad') },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const copy = details[locale];

  return (
    <article className="mx-auto max-w-4xl px-6 py-16 text-slate-800 md:py-24">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-700">SIGUE Network</p>
      <h1 className="mb-8 text-4xl font-bold text-slate-950 md:text-5xl">{copy.title}</h1>
      <p className="mb-10 text-lg leading-8">{copy.intro}</p>
      <div className="space-y-9">
        {copy.sections.map(([heading, body]) => (
          <section key={heading}>
            <h2 className="mb-3 text-2xl font-bold text-slate-950">{heading}</h2>
            <p className="leading-7">{body}</p>
          </section>
        ))}
      </div>
      <p className="mt-12 rounded-lg bg-violet-50 p-5 text-sm leading-6">{copy.updated}</p>
      <Link className="mt-8 inline-block font-semibold text-violet-700 underline" href={`/${locale}`}>{copy.home}</Link>
    </article>
  );
}
