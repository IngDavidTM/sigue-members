import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página no encontrada | SIGUE Network',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-7xl font-black text-primary">404</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-secondary-deep">Página no encontrada</h1>
        <p className="mt-4 text-lg text-slate-600">
          La dirección puede haber cambiado durante la migración. Revisa el enlace o vuelve al inicio.
        </p>
        <p className="mt-2 text-sm text-slate-500">This page could not be found.</p>
        <Link
          href="/es"
          className="mt-8 inline-block rounded-md bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary-hover"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
