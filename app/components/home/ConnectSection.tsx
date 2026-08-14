'use client';

import { useTranslations } from 'next-intl';
import CardService from '@/app/components/ui/CardService';
import Reveal from '@/app/components/ui/Reveal';

export default function ConnectSection() {
  const t = useTranslations('connect');

  const connectCards = [
    {
      key: 'community',
      title: t('cards.community.title'),
      question: t('cards.community.question'),
      description: (
        <>
          {t('cards.community.description')}
          <strong>{t('cards.community.descriptionBold')}</strong>
          {t('cards.community.descriptionEnd')}
        </>
      ),
      ctaLabel: t('cards.community.ctaLabel'),
      ctaSubLabel: t('cards.community.ctaSubLabel'),
      // ctaHref: "/comunidad",
    },
    {
      key: 'events',
      title: t('cards.events.title'),
      question: t('cards.events.question'),
      description: (
        <>
          {t('cards.events.description')}
          <strong>{t('cards.events.descriptionBold')}</strong>
          {t('cards.events.descriptionEnd')}
        </>
      ),
      ctaLabel: t('cards.events.ctaLabel'),
      ctaSubLabel: t('cards.events.ctaSubLabel'),
      // ctaHref: "/eventos",
    },
    {
      key: 'alliances',
      title: t('cards.alliances.title'),
      question: t('cards.alliances.question'),
      description: <>{t('cards.alliances.description')}</>,
      ctaLabel: t('cards.alliances.ctaLabel'),
      ctaSubLabel: t('cards.alliances.ctaSubLabel'),
      // ctaHref: "/alianzas",
    },
  ] as const;

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-1 md:px-2">
        <Reveal variant="slide-left" className="flex flex-col gap-3 md:hidden">
          <div
            className="bg-secondary flex items-center justify-start w-full"
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

          <div className="bg-primary flex items-center w-full" style={{ padding: '1.75rem 1rem' }}>
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
          variant="slide-left"
          className="hidden md:flex md:flex-row md:gap-4 lg:gap-12 xl:gap-24 md:items-stretch"
        >
          <div
            className="bg-secondary flex items-center justify-start shrink-0 md:self-start md:aspect-square"
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

          <div
            className="bg-primary flex items-center flex-1"
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
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-6 pt-6 pb-12 md:pt-8 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3 lg:gap-6 xl:gap-10 items-stretch">
          {connectCards.map((card, index) => (
            <Reveal key={card.key} variant="fade-up" delay={index * 0.1} className="h-full">
              <CardService
                variant="pink"
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
