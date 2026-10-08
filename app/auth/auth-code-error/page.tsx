import Link from 'next/link';

export const metadata = { title: 'Enlace de acceso inválido | SIGUE Network' };

export default function AuthCodeErrorPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-6 text-center">
      <h1 className="text-3xl font-bold">No pudimos completar el acceso</h1>
      <p className="mt-4 text-lg">El enlace puede haber vencido o ya se utilizó. Solicita uno nuevo o vuelve a iniciar sesión.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link className="rounded-lg bg-violet-700 px-5 py-3 font-semibold text-white" href="/login">Iniciar sesión</Link>
        <Link className="rounded-lg border border-violet-700 px-5 py-3 font-semibold text-violet-700" href="/forgot-password">Solicitar otro enlace</Link>
      </div>
    </main>
  );
}
