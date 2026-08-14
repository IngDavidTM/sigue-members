'use client';

import { useTranslations } from 'next-intl';
import CardService from '@/app/components/ui/CardService';
import Reveal from '@/app/components/ui/Reveal';

export default function TracksSection() {
  const t = useTranslations('tracks');

  const tracksCards = [
    {
      key: 'consulting',
      title: t('cards.consulting.title'),
      question: t('cards.consulting.question'),
      description: (
        <>
          {t('cards.consulting.description')}
          <strong>{t('cards.consulting.descriptionBold')}</strong>
          {t('cards.consulting.descriptionEnd')}
        </>
      ),
      ctaLabel: t('cards.consulting.ctaLabel'),
      ctaSubLabel: t('cards.consulting.ctaSubLabel'),
      // ctaHref: "/consulting", // TODO: enlazar cuando exista la página interna
    },
    {
      key: 'academy',
      title: t('cards.academy.title'),
      question: t('cards.academy.question'),
      description: (
        <>
          {t('cards.academy.description')}
          <strong>{t('cards.academy.descriptionBold')}</strong>
          {t('cards.academy.descriptionEnd')}
        </>
      ),
      ctaLabel: t('cards.academy.ctaLabel'),
      ctaSubLabel: t('cards.academy.ctaSubLabel'),
      // ctaHref: "/academy", // TODO: enlazar cuando exista la página interna
    },
    {
      key: 'hub',
      title: t('cards.hub.title'),
      question: t('cards.hub.question'),
      description: (
        <>
          {t('cards.hub.description')}
          <strong>{t('cards.hub.descriptionBold')}</strong>
          {t('cards.hub.descriptionEnd')}
        </>
      ),
      ctaLabel: t('cards.hub.ctaLabel'),
      ctaSubLabel: t('cards.hub.ctaSubLabel'),
      // ctaHref: "/hub", // TODO: enlazar cuando exista la página interna
    },
  ] as const;

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-1 md:px-2">
        <Reveal variant="slide-right" className="flex flex-col gap-3 md:hidden">
          <div
            className="bg-primary flex items-center justify-start w-full"
            style={{ padding: '2rem 1rem', minHeight: '8rem' }}
          >
            <h2
              className="font-heading font-bold text-white text-left w-full"
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
                lineHeight: 1.0,
                padding: '0.05rem 8px',
              }}
            >
              {t('heading')}
            </h2>
          </div>

          <div
            className="bg-secondary flex items-center w-full"
            style={{ padding: '1.75rem 1rem' }}
          >
            <p
              className="font-sans text-white w-full"
              style={{ fontSize: '1.1rem', lineHeight: 1.4 }}
            >
              {t('intro')}
              <strong>{t('introBold')}</strong>
              {t('introEnd')}
            </p>
          </div>
        </Reveal>

        <Reveal
          variant="slide-right"
          className="hidden md:flex md:flex-row md:gap-4 lg:gap-12 xl:gap-24 md:items-stretch"
        >
          <div
            className="bg-secondary flex items-center flex-1"
            style={{
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
              paddingLeft: '0.6rem',
              paddingRight: '0.6rem',
            }}
          >
            <p
              className="font-sans text-white w-full"
              style={{
                fontSize: 'clamp(1.2rem, 1.8vw, 1.8rem)',
                lineHeight: 1.4,
              }}
            >
              {t('intro')}
              <strong>{t('introBold')}</strong>
              {t('introEnd')}
            </p>
          </div>

          <div
            className="bg-primary flex items-center justify-start shrink-0 md:self-start md:aspect-square"
            style={{ padding: '1.5rem 0.75rem' }}
          >
            <h2
              className="font-heading font-bold text-white text-left w-full"
              style={{
                lineHeight: 1.0,
                padding: '0.05rem 8px',
                fontSize: 'clamp(2.5rem, 3vw, 3.5rem)',
              }}
            >
              {t('headingLine1')}
              <br />
              {t('headingLine2')}
              <br />
              {t('headingLine3')}
            </h2>
          </div>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-6 pt-6 pb-12 md:pt-8 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3 lg:gap-6 xl:gap-10 items-stretch">
          {tracksCards.map((card, index) => (
            <Reveal key={card.key} variant="fade-up" delay={index * 0.1} className="h-full">
              <CardService
                variant="purple"
                title={card.title}
                question={card.question}
                description={card.description}
                ctaLabel={card.ctaLabel}
                ctaSubLabel={card.ctaSubLabel}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
