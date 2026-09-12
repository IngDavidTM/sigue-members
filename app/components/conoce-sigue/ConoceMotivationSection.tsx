import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const MOTIVATION_IMAGE = '/images/MotivationSection1.jpg';
const PROPOSITO_IMAGE = '/images/MotivationSection2.jpg';
const VISION_IMAGE = '/images/MotivationSection3.jpg';
const MISION_IMAGE = '/images/MotivationSection4.jpg';
const ALCANCE_IMAGE = '/images/MotivationSection5.jpg';
const BOTTOM_IMAGE = '/images/MotivationSection6.png';

type CardKey = 'proposito' | 'vision' | 'mision' | 'alcance';

interface IdentityCardData {
  key: CardKey;
  imageLeft: boolean;
  image: string;
  bgClass: string;
  bgStyle?: React.CSSProperties;
  titleColorClass: string;
  btnBgClass: string;
  btnTextClass: string;
}

const CARDS: IdentityCardData[] = [
  {
    key: 'proposito',
    imageLeft: true,
    image: PROPOSITO_IMAGE,
    bgClass: 'bg-secondary-deep',
    titleColorClass: 'text-white',
    btnBgClass: 'bg-primary',
    btnTextClass: 'text-white',
  },
  {
    key: 'vision',
    imageLeft: false,
    image: VISION_IMAGE,
    bgClass: 'bg-secondary',
    titleColorClass: 'text-white',
    btnBgClass: 'bg-primary',
    btnTextClass: 'text-white',
  },
  {
    key: 'mision',
    imageLeft: true,
    image: MISION_IMAGE,
    bgClass: '',
    bgStyle: { backgroundColor: '#EC598F' },
    titleColorClass: 'text-white',
    btnBgClass: 'bg-secondary',
    btnTextClass: 'text-white',
  },
  {
    key: 'alcance',
    imageLeft: false,
    image: ALCANCE_IMAGE,
    bgClass: '',
    bgStyle: { backgroundColor: '#B51BA1' },
    titleColorClass: 'text-white',
    btnBgClass: 'bg-primary',
    btnTextClass: 'text-white',
  },
];

function getCardHref(key: CardKey): string {
  switch (key) {
    case 'proposito':
      // TODO: enlazar a página sigue-tracks cuando exista
      return '#';
    case 'vision':
      // TODO: enlazar a siguehub cuando exista
      return '#';
    case 'mision':
      // Lleva a inicio
      return '/';
    case 'alcance':
      // TODO: enlazar a siguehub cuando exista
      return '#';
  }
}

function IdentityCard({
  card,
  t,
}: {
  card: IdentityCardData;
  t: ReturnType<typeof useTranslations>;
}) {
  const textPanel = (
    <div
      className={`${card.bgClass} w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 lg:px-16 lg:py-12 relative`}
      style={card.bgStyle}
    >
      <div
        className={`absolute top-0 w-16 h-16 bg-primary ${card.imageLeft ? 'right-0' : 'left-0'}`}
        aria-hidden="true"
      />
      <h2
        className={`font-heading text-3xl lg:text-4xl font-bold ${card.titleColorClass} mb-5 leading-tight text-center`}
      >
        {t(`identity.${card.key}.title`)}
      </h2>
      <p className="font-sans text-xl lg:text-xl text-white/90 leading-relaxed mb-8 text-justify">
        {t(`identity.${card.key}.description`)}
      </p>
      <Link
        href={getCardHref(card.key)}
        className={`${card.btnBgClass} ${card.btnTextClass} font-heading font-bold text-base lg:text-lg px-8 py-3 self-center hover:opacity-90 transition-opacity text-center`}
      >
        {t(`identity.${card.key}.cta`)}
      </Link>
    </div>
  );

  const imagePanel = (
    <div className="w-full lg:w-1/2 relative min-h-[230px] lg:min-h-[300px]">
      <Image
        src={card.image}
        alt={t(`identity.${card.key}.imageAlt`)}
        fill
        sizes="(max-width: 1023px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:hidden flex flex-col">
        {imagePanel}
        {textPanel}
      </div>
      <div className="hidden lg:flex lg:flex-row w-full items-stretch">
        {card.imageLeft ? (
          <>
            {imagePanel}
            {textPanel}
          </>
        ) : (
          <>
            {textPanel}
            {imagePanel}
          </>
        )}
      </div>
    </div>
  );
}

export default function ConoceMotivationSection() {
  const t = useTranslations('conoceSiguePage.motivation');

  return (
    <section className="w-full">
      <div className="lg:hidden">
        <div className="bg-secondary-deep px-6 py-6 flex items-end">
          <h2 className="font-heading text-white leading-none m-0">
            <span className="block text-[2rem] font-normal whitespace-nowrap">
              {t('heroTitleStart')}
            </span>
            <span className="block text-[2rem] font-bold text-primary leading-[0.9] whitespace-nowrap">
              {t('heroTitleBold')}
            </span>
          </h2>
        </div>

        <div className="w-full bg-primary" style={{ height: '22px' }} aria-hidden="true" />
        <div
          className="w-full"
          style={{ backgroundColor: '#DED4FF', height: '22px' }}
          aria-hidden="true"
        />

        <div className="bg-primary w-full pl-4 pr-8 py-5 flex flex-col items-end text-right">
          <p className="font-heading text-[1.68rem] font-normal text-white leading-[1.6] mb-5 max-w-[26rem]">
            {t('heroText')}
          </p>
          {/* TODO: enlazar a página de miembros cuando exista */}
          <Link
            href="#"
            className="bg-secondary-deep text-white font-heading px-5 py-1.5 text-center hover:opacity-90 transition-opacity w-7/12"
          >
            <span className="block font-black uppercase text-[1.3rem] leading-none">
              {t('heroCTATitle')}
            </span>
            <span className="block font-bold text-sm leading-tight mt-1">
              {t('heroCTASubtitle')}
            </span>
          </Link>
        </div>

        <div className="relative w-full aspect-[5/4]">
          <Image
            src={MOTIVATION_IMAGE}
            alt={t('heroImageAlt')}
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute top-3 left-3 w-14 h-14 bg-primary/85" aria-hidden="true" />
          <div className="absolute top-[5rem] left-3 w-14 h-48 bg-white/55" aria-hidden="true" />
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="h-3 w-full" style={{ backgroundColor: '#DED4FF' }} aria-hidden="true" />

        <div className="flex items-stretch w-full">
          <div className="flex-[0_0_51%] bg-white" />
          <div className="flex-1 bg-secondary-deep flex items-end px-8 py-3">
            <h2 className="font-heading text-white m-0 leading-none">
              <span className="block text-3xl xl:text-[2.1rem] font-normal">
                {t('heroTitleStart')}
              </span>
              <span className="block text-3xl xl:text-[2.1rem] font-bold text-primary leading-[0.9]">
                {t('heroTitleBold')}
              </span>
            </h2>
          </div>
          <div className="w-40 xl:w-52 bg-primary shrink-0" />
        </div>

        <div className="h-3 w-full" style={{ backgroundColor: '#DED4FF' }} aria-hidden="true" />

        <div className="flex items-stretch w-full min-h-[218px]">
          <div className="flex-[0_0_51%] bg-primary flex flex-col justify-center pl-10 pr-16 py-6">
            <p className="font-heading text-[1.58rem] xl:text-[1.72rem] font-normal text-white text-right leading-[1.45] mb-5 ml-auto max-w-[24rem]">
              {t('heroText')}
            </p>
            <div className="flex justify-end">
              {/* TODO: enlazar a página de miembros cuando exista */}
              <Link
                href="#"
                className="bg-secondary-deep text-white font-heading px-7 py-3 text-center hover:opacity-90 transition-opacity max-w-[280px]"
              >
                <span className="block font-black uppercase text-[1.6rem] leading-none">
                  {t('heroCTATitle')}
                </span>
                <span className="block font-bold text-sm leading-tight mt-0.5">
                  {t('heroCTASubtitle')}
                </span>
              </Link>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <Image
              src={MOTIVATION_IMAGE}
              alt={t('heroImageAlt')}
              fill
              sizes="49vw"
              className="object-cover object-top"
            />
            <div
              className="absolute top-4 left-4 w-[4rem] h-[4rem] bg-primary/85"
              aria-hidden="true"
            />
            <div
              className="absolute top-[7rem] left-4 w-[4rem] h-44 bg-white/55"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1180px] mx-auto pt-10 lg:pt-14">
        {CARDS.map((card) => (
          <IdentityCard key={card.key} card={card} t={t} />
        ))}
      </div>

      <img
        src={BOTTOM_IMAGE}
        alt=""
        className="w-full h-[180px] lg:h-[260px] object-cover object-center block mt-6 lg:mt-8 mb-10 lg:mb-14"
      />
    </section>
  );
}
