'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6 py-20 text-center">
      <div className="max-w-xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">SIGUE Network</p>
        <h1 className="font-heading text-4xl font-bold text-secondary-deep">Algo salió mal</h1>
        <p className="mt-4 text-lg text-slate-600">
          No pudimos cargar esta página. Puedes intentarlo nuevamente o regresar al inicio.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          We could not load this page. Please try again or return home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-md bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary-hover"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="rounded-md border border-secondary-deep px-6 py-3 font-bold text-secondary-deep transition-colors hover:bg-accent-pink"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
