import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '@/app/components/ui/Reveal';

export default function InvolvementSection() {
  const t = useTranslations('involvement');

  const cards = ['volunteer', 'donate', 'pray'] as const;

  return (
    <section className="w-full bg-[#E2E3FF] px-4 py-16 md:px-8 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
          <Reveal variant="fade" className="mx-auto w-full max-w-[320px] lg:max-w-none">
            <div className="relative aspect-[3/4] overflow-hidden border-l-[18px] border-secondary">
              <Image
                src="/images/home-involvement.avif"
                alt={t('imageAlt')}
                fill
                sizes="(min-width: 1024px) 340px, 80vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div>
            <Reveal variant="slide-right">
              <div className="mb-5 flex items-center gap-5">
                <div aria-hidden="true" className="hidden h-24 w-24 shrink-0 bg-primary sm:block" />
                <h2 className="font-heading text-4xl leading-[0.95] text-secondary-deep md:text-5xl">
                  <strong className="font-black">{t('heading')}</strong>
                  <br />
                  {t('subheading')}
                </h2>
              </div>
            </Reveal>

            <Reveal variant="slide-right" delay={0.1}>
              <div className="flex min-h-52 bg-secondary-deep">
                <div aria-hidden="true" className="m-5 hidden w-24 shrink-0 bg-white sm:block" />
                <p className="self-center px-6 py-8 font-sans text-lg leading-relaxed text-white md:px-8 md:text-2xl">
                  {t('intro')}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 grid items-stretch gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <Reveal key={card} variant="fade-up" delay={index * 0.1} className="h-full">
              <article className="flex h-full flex-col">
                <div className="flex flex-1 flex-col bg-primary px-6 py-8 text-center text-white">
                  <h3 className="font-heading text-xl font-black leading-tight">
                    {t(`cards.${card}.title`)}
                    <span className="mt-1 block text-base font-bold">
                      {t(`cards.${card}.subtitle`)}
                    </span>
                  </h3>
                  <p className="mt-7 font-sans text-base font-bold leading-snug">
                    {t(`cards.${card}.question`)}
                  </p>
                  <p className="mt-5 flex-1 font-sans text-base leading-relaxed">
                    {t(`cards.${card}.description`)}
                  </p>
                </div>

                <div className="h-4 bg-[#E2E3FF]" />

                <button
                  type="button"
                  className="min-h-20 bg-secondary-deep px-5 py-3 text-center text-white transition-colors duration-200 hover:bg-secondary"
                >
                  <span className="block font-heading text-lg font-black">
                    {t(`cards.${card}.ctaLabel`)}
                  </span>
                  <span className="block font-sans text-sm font-bold leading-tight">
                    {t(`cards.${card}.ctaSubLabel`)}
                  </span>
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
