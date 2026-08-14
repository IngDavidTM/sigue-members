import type { ReactNode } from 'react';
// import { useRouter } from 'next/navigation'; // TODO: descomentar cuando se activen los links

export type CardServiceVariant = 'pink' | 'purple';

export interface CardServiceProps {
  title: string;
  question: string;
  description: ReactNode;
  ctaLabel: string;
  ctaSubLabel?: string;
  variant?: CardServiceVariant;
  ctaHref?: string; // TODO: enlazar cuando exista la página interna — pasar desde el padre
}

type VariantStyle = {
  card: string;
  title: string;
  question: string;
  body: string;
  cta: string;
};

const variantStyles: Record<CardServiceVariant, VariantStyle> = {
  pink: {
    card: 'bg-accent-pink',
    title: 'text-primary',
    question: 'text-primary',
    body: 'text-secondary-dark',
    cta: 'bg-primary hover:bg-primary/90 text-white',
  },
  purple: {
    card: 'bg-accent-light-purple',
    title: 'text-secondary',
    question: 'text-secondary',
    body: 'text-secondary-dark',
    cta: 'bg-secondary hover:bg-secondary-dark text-white',
  },
};

export default function CardService({
  title,
  question,
  description,
  ctaLabel,
  ctaSubLabel,
  variant = 'pink',
  // ctaHref, // TODO: activar cuando exista la ruta interna
}: CardServiceProps) {
  // const router = useRouter(); // TODO: descomentar cuando se activen los links
  const s = variantStyles[variant];

  return (
    <div className="flex flex-col h-full">
      <div className="hidden xl:block relative w-full shrink-0" style={{ paddingBottom: '100%' }}>
        <div
          className={`${s.card} absolute inset-0 flex flex-col text-center`}
          style={{ padding: 'clamp(1rem, 2vw, 1.8rem)' }}
        >
          <p
            className={`${s.title} font-heading uppercase tracking-widest shrink-0`}
            style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2 }}
          >
            {title}
          </p>
          <p
            className={`${s.question} font-heading font-bold leading-snug shrink-0`}
            style={{ fontSize: '1.05rem', marginTop: '2em' }}
          >
            {question}
          </p>
          <p
            className={`${s.body} font-sans leading-snug flex-1`}
            style={{
              fontSize: '1rem',
              marginTop: '2em',
              display: 'flex',
              alignItems: 'flex-start',
              textAlign: 'center',
              color: '#411E65',
            }}
          >
            <span className="w-full">{description}</span>
          </p>
        </div>
      </div>

      <div
        className={`${s.card} flex flex-col text-center xl:hidden flex-1`}
        style={{ padding: '1.5rem 1.25rem', minHeight: '20rem' }}
      >
        <div className="shrink-0">
          <p
            className={`${s.title} font-heading uppercase tracking-widest`}
            style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2 }}
          >
            {title}
          </p>
          <p
            className={`${s.question} font-heading font-bold leading-snug`}
            style={{ fontSize: '1.05rem', marginTop: '1.5em' }}
          >
            {question}
          </p>
        </div>

        <div className="flex-1 flex items-start justify-center pt-5">
          <p
            className={`${s.body} font-sans leading-snug`}
            style={{ fontSize: '1rem', textAlign: 'center', color: '#411E65' }}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="h-3 md:h-5 bg-white shrink-0" />

      <div className="xl:px-[11%] shrink-0">
        <button
          type="button"
          className={`${s.cta} w-full flex flex-col items-center justify-center
            transition-colors duration-200 cursor-pointer py-3 md:min-h-[6rem] md:py-4`}
          style={{ fontSize: '1.1rem' }}
          // onClick={() => router.push(ctaHref!)} // TODO: activar cuando exista la ruta interna
        >
          <span className="font-heading font-black uppercase tracking-widest block">
            {ctaLabel}
          </span>
          {ctaSubLabel && (
            <span
              className="font-sans font-bold normal-case tracking-normal block px-4"
              style={{ fontSize: '1rem', lineHeight: 1.3, marginTop: '0.2rem' }}
            >
              {ctaSubLabel}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
