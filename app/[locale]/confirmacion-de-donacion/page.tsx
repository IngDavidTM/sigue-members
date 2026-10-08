import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Donación | SIGUE Network', robots: { index: false, follow: false } };

export default async function ConfirmacionDeDonacionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const english = locale === 'en';
  return <main className="mx-auto flex min-h-[65vh] max-w-2xl flex-col justify-center px-6 py-20 text-center">
    <h1 className="text-4xl font-bold">{english ? 'Thank you for supporting SIGUE Network' : 'Gracias por apoyar a SIGUE Network'}</h1>
    <p className="mt-6 text-lg leading-8">{english
      ? 'If you completed a donation, check your email for the payment provider’s confirmation. This page cannot verify payment status. For help, contact info@siguenetwork.org.'
      : 'Si completaste una donación, revisa en tu correo la confirmación del proveedor de pagos. Esta página no verifica el estado del pago. Si necesitas ayuda, escribe a info@siguenetwork.org.'}</p>
    <Link href={`/${locale}`} className="mt-8 font-semibold text-violet-700 underline">{english ? 'Back to home' : 'Volver al inicio'}</Link>
  </main>;
}
