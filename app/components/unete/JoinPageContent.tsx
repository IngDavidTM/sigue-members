'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import PageHero from '@/app/components/ui/PageHero';

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}

const volunteerImages = [
  '/images/join-volunteer-1.jpg',
  '/images/join-volunteer-2.jpg',
  '/images/join-volunteer-3.jpg',
  '/images/join-volunteer-4.jpg',
] as const;

const meaningKeys = ['projects', 'network', 'growth'] as const;

const areas = [
  { key: 'mentoring', image: '/images/join-area-mentoring.png' },
  { key: 'workshops', image: '/images/join-area-workshops.png' },
  { key: 'technical', image: '/images/join-area-technical.png' },
  { key: 'content', image: '/images/join-area-content.png' },
  { key: 'social', image: '/images/join-area-social.png' },
  { key: 'impact', image: '/images/join-area-impact.png' },
  { key: 'events', image: '/images/join-area-events.png' },
] as const;

const processKeys = ['interest', 'interview', 'orientation', 'assignment', 'service'] as const;

const interestFormUrl =
  'https://docs.google.com/forms/d/1JYUumNnWCHKOCYZGvCZX-tko3UowVio2nHweL41Us2o/viewform?edit_requested=true';

const supportItems = [
  { key: 'mission', path: '/contacto' },
  { key: 'donate', path: '/donacion' },
  { key: 'academy', path: '/sigue-academy' },
  { key: 'summit', path: '/cumbre-sigue-2026' },
  { key: 'prayer', external: 'https://docs.google.com/forms/d/e/1FAIpQLSdj0gs75NwmuRb0qQdSrdZ4Y2SwQRdroBd5XxS7QtN960SR7w/viewform' },
  { key: 'volunteers', external: interestFormUrl },
] as const;

const faqKeys = [
  'benefits',
  'deductible',
  'howTo',
  'specific',
  'transparency',
  'updates',
  'companies',
  'questions',
] as const;

function SectionBand({
  children,
  side = 'left',
}: {
  children: React.ReactNode;
  side?: 'left' | 'right';
}) {
  return (
    <div className="grid min-h-[132px] grid-cols-[31%_69%] overflow-hidden bg-[#531f72] text-white md:min-h-[150px]">
      {side === 'left' ? (
        <>
          <div className="bg-[#c95ae4]" aria-hidden="true" />
          <div className="flex items-center px-8 md:px-16">{children}</div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-end px-8 text-right md:px-16">{children}</div>
          <div className="bg-[#c95ae4]" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

export default function JoinPageContent() {
  const t = useTranslations('joinPage');
  const locale = useLocale() === 'en' ? 'en' : 'es';
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <main className="overflow-x-hidden bg-white" data-join-page>
      <PageHero
        imageSrc="/images/join-hero.jpg"
        imageAlt={t('hero.imageAlt')}
        badge={t('hero.badge')}
        title={
          <>
            <span className="block">{t('hero.line1')}</span>
            <span className="block">{t('hero.line2')}</span>
            <span className="block">{t('hero.line3')}</span>
          </>
        }
        subtitle={t('hero.subtitle')}
        imageOverlayClassName="bg-white/20"
        animate={false}
      />

      <section className="relative bg-white pt-5 md:bg-[linear-gradient(to_right,#c95ae4_0_20%,#fff_20%_100%)] md:pt-12">
        <div className="relative grid md:grid-cols-[37.5%_62.5%]">
          <div className="hidden md:block" aria-hidden="true" />
          <div className="grid w-full grid-cols-2 overflow-hidden sm:grid-cols-4">
            {volunteerImages.map((src, index) => (
              <div key={src} className="relative aspect-[0.93] sm:aspect-[0.78]">
                  <Image
                    src={src}
                    alt={`${t('gallery.imageAlt')} ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover"
                  />
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid min-h-[112px] grid-cols-[20%_28%_52%] md:min-h-[245px]">
          <div className="bg-[#c95ae4]" />
          <div className="relative bg-[#6a08ad]">
            <span className="absolute right-4 top-3 h-8 w-8 bg-primary md:right-8 md:top-7 md:h-16 md:w-16" />
            <span className="absolute right-4 top-14 h-12 w-8 bg-white md:right-8 md:top-28 md:h-28 md:w-16" />
          </div>
          <div className="flex items-center bg-[#7410f4] px-4 md:px-12">
            <Reveal variant="fade-up">
              <h2 className="font-heading text-xl leading-none text-white md:text-4xl">
                <strong className="block font-black">{t('gallery.title')}</strong>
                <span className="font-light">{t('gallery.subtitle')}</span>
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-accent-light-purple">
        <div className="grid md:min-h-[210px] md:grid-cols-[25%_13%_62%] md:items-stretch">
          <div className="hidden bg-white md:block" aria-hidden="true" />
          <Reveal variant="fade-up" className="h-full">
            <div className="flex h-full min-h-[220px] flex-col items-end justify-center bg-primary px-8 py-10 text-right font-heading text-2xl leading-tight text-white md:min-h-0 md:px-6 md:py-8 md:text-xl lg:px-7">
              <strong className="block w-full font-black">
                <span className="block">{t('intro.titleStart')}</span>
                <span className="block">{t('intro.titleBold')}</span>
              </strong>
              <span className="block w-full">{t('intro.titleEnd')}</span>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={0.1} className="flex items-center">
            <p className="px-5 py-8 font-sans text-lg leading-snug text-[#6221a5] md:max-w-4xl md:px-12 md:py-10 md:text-xl lg:px-16">
              {t('intro.bodyStart')}
              <strong>{t('intro.bodyBold1')}</strong>
              {t('intro.bodyMid')}
              <strong>{t('intro.bodyBold2')}</strong>
              {t('intro.bodyEnd')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-10 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-[360px_1fr] md:items-stretch md:gap-10">
          <Reveal variant="fade-up" className="h-full">
            <div className="flex h-full min-h-[230px] items-center justify-center bg-[#c95ae4] px-8 py-10 text-center md:min-h-[260px]">
              <h2 className="w-full font-heading text-3xl font-black leading-[1.7] text-white md:text-4xl">
                {t('meaning.title')}
              </h2>
            </div>
          </Reveal>
          <div className="space-y-3 px-4 md:space-y-5 md:px-0">
            {meaningKeys.map((key, index) => (
              <Reveal key={key} variant="fade-up" delay={index * 0.08}>
                <div className="flex min-h-[120px] items-center bg-[#e3e4ff] px-8 py-6 font-sans text-lg leading-snug text-[#622b92] md:min-h-[82px] md:px-12 md:py-5 md:text-xl">
                  {t(`meaning.items.${key}`)}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9dfff]">
        <SectionBand>
          <Reveal variant="slide-right">
            <h2 className="font-heading text-3xl leading-none md:text-4xl">
              <span className="block">{t('areas.headingStart')}</span>
              <strong className="font-black">{t('areas.headingBold')}</strong>
            </h2>
          </Reveal>
        </SectionBand>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-12 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10 lg:py-20">
          {areas.map((area, index) => (
            <Reveal
              key={area.key}
              variant="fade-up"
              delay={(index % 3) * 0.08}
              className={index === areas.length - 1 ? 'lg:col-start-2' : ''}
            >
              <article className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-5">
                <div className="relative aspect-square w-[164px] shrink-0 sm:w-[120px] md:w-[142px]">
                  <Image src={area.image} alt="" fill sizes="142px" className="object-contain" />
                </div>
                <h3 className="max-w-[190px] font-heading text-sm font-black leading-[0.95] text-[#7016c7] sm:text-xl">
                  {t(`areas.items.${area.key}`)}
                </h3>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <SectionBand>
          <Reveal variant="slide-right">
            <h2 className="font-heading text-3xl leading-none md:text-4xl">
              <span className="block">{t('process.headingStart')}</span>
              <strong className="font-black">{t('process.headingBold')}</strong>
            </h2>
          </Reveal>
        </SectionBand>

        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="hidden lg:block">
            <div className="grid grid-cols-5">
              {processKeys.map((key, index) => (
                <Reveal key={key} variant={index % 2 === 0 ? 'fade-down' : 'fade-up'}>
                  <p
                    className={`min-h-[74px] px-2 text-center font-heading text-lg leading-tight text-[#63219d] ${
                      index % 2 === 0 ? '' : 'pt-8'
                    }`}
                  >
                    {t(`process.steps.${key}`)}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal variant="scale">
              <Image
                src="/images/join-process.png"
                alt={t('process.imageAlt')}
                width={1024}
                height={195}
                sizes="(max-width: 1200px) 90vw, 1152px"
                className="h-auto w-full"
              />
            </Reveal>
          </div>

          <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-1 before:bg-[#c95ae4] lg:hidden">
            {processKeys.map((key, index) => (
              <Reveal key={key} variant="slide-right" delay={index * 0.06}>
                <li className="relative flex items-center gap-5">
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center bg-[#7410f4] font-heading text-lg font-black text-white">
                    {index + 1}
                  </span>
                  <p className="font-heading text-lg font-bold leading-tight text-[#63219d]">
                    {t(`process.steps.${key}`)}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <SectionBand>
          <Reveal variant="slide-right">
            <h2 className="font-heading text-3xl leading-none md:text-4xl">
              <span>{t('ready.headingStart')} </span>
              <strong className="font-black">{t('ready.headingBold')}</strong>
            </h2>
          </Reveal>
        </SectionBand>

        <div className="grid bg-white md:grid-cols-[31%_69%]">
          <Reveal variant="slide-left" className="relative min-h-[310px] md:min-h-[390px]">
            <Image
              src="/images/join-ready.png"
              alt={t('ready.imageAlt')}
              fill
              sizes="(max-width: 768px) 100vw, 31vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal
            variant="fade-up"
            className="flex items-center px-6 py-12 md:px-16 md:py-16 lg:px-20"
          >
            <div>
              <p className="max-w-3xl font-heading text-xl leading-snug text-black md:text-2xl">
                {t('ready.description')}
              </p>
              <a
                href={interestFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-w-[190px] flex-col items-center bg-primary px-6 py-4 font-heading text-lg font-black leading-none text-white transition-transform duration-300 hover:-translate-y-1 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
              >
                <span>{t('ready.buttonLine1')}</span>
                <span className="text-sm">{t('ready.buttonLine2')}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f3f3f3] px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {supportItems.map((item, index) => {
            const card = (
              <article className="group relative min-h-[245px] bg-white px-7 py-8 shadow-[0_8px_25px_rgba(0,0,0,0.03)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(82,32,120,0.12)]">
                <h2 className="max-w-[260px] font-heading text-3xl font-black leading-tight text-[#222]">
                  {t(`support.cards.${item.key}.title`)}
                </h2>
                <p className="mt-14 max-w-[260px] font-heading text-lg font-bold leading-snug text-[#222]">
                  {t(`support.cards.${item.key}.description`)}
                </p>
                <ArrowUpRight className="absolute bottom-6 right-6 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
              </article>
            );

            return (
              <Reveal key={item.key} variant="fade-up" delay={(index % 3) * 0.08}>
                {'external' in item ? (
                  <a href={item.external} target="_blank" rel="noreferrer" aria-label={t(`support.cards.${item.key}.title`)}>{card}</a>
                ) : (
                  <Link href={`/${locale}${item.path}`} aria-label={t(`support.cards.${item.key}.title`)}>{card}</Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-28">
        <Reveal variant="fade-up">
          <h2 className="text-center font-heading text-3xl font-black text-black md:text-4xl">
            {t('faq.title')}
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 max-w-5xl space-y-3">
          {faqKeys.map((key, index) => {
            const isOpen = openFaq === key;
            const panelId = `faq-panel-${key}`;

            return (
              <Reveal key={key} variant="fade-up" delay={Math.min(index * 0.04, 0.2)}>
                <div className="overflow-hidden bg-[#f4f4f4]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : key)}
                    className="flex w-full items-center gap-5 px-5 py-4 text-left font-heading text-base font-black text-black transition-colors hover:bg-[#ece8f7] md:px-7 md:text-lg"
                  >
                    <span
                      className={`text-2xl font-light text-primary transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                    <span>{t(`faq.items.${key}.question`)}</span>
                  </button>
                  <div
                    id={panelId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-14 pb-5 font-sans text-base leading-relaxed text-[#4b4b4b] md:px-[72px]">
                        {t(`faq.items.${key}.answer`)}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-background-soft px-6 py-24 text-center md:py-32">
        <Reveal variant="scale">
          <h2 className="font-heading text-3xl font-black text-black md:text-4xl">
            {t('closing.title')}
          </h2>
          <Link
            href={`/${locale}/contacto`}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-md border-2 border-white bg-primary px-7 py-3 font-heading text-sm font-black text-white shadow-[0_0_0_1px_#f50d4f] transition-transform hover:-translate-y-1"
          >
            {t('closing.cta')}
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
