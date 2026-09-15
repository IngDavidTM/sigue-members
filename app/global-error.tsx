'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="es">
      <head>
        <title>Error | SIGUE Network</title>
      </head>
      <body style={{ margin: 0, background: '#fff', color: '#502076', fontFamily: 'Arial, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px', textAlign: 'center' }}>
          <div style={{ maxWidth: '640px' }}>
            <p style={{ color: '#ef1351', fontWeight: 800, letterSpacing: '0.16em' }}>SIGUE NETWORK</p>
            <h1 style={{ margin: '12px 0', fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>Algo salió mal</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Ocurrió un error inesperado. Intenta nuevamente en unos segundos.
            </p>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              An unexpected error occurred. Please try again in a few seconds.
            </p>
            <button
              type="button"
              onClick={() => retry()}
              style={{ marginTop: '20px', border: 0, borderRadius: '6px', background: '#ef1351', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, padding: '13px 24px' }}
            >
              Intentar de nuevo
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
