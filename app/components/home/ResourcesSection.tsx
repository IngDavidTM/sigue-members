import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Reveal from '@/app/components/ui/Reveal';

interface ResourceItem {
  titleKey: string;
  descriptionKey: string;
  image: string;
  imageAlt: string;
  href: string;
}

const IMAGE_H = 240;
const BLOCK_H = 130;

function ResourceCard({
  titleKey,
  descriptionKey,
  image,
  imageAlt,
  href,
  t,
}: ResourceItem & { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="w-full mb-6">
      <div className="hidden md:flex items-stretch" style={{ height: `${IMAGE_H}px` }}>
        <div className="flex flex-col" style={{ width: '55%' }}>
          <div
            className="flex flex-col justify-center"
            style={{
              backgroundColor: '#CFC1FF',
              height: `${BLOCK_H}px`,
              paddingLeft: '44%',
              paddingRight: '1rem',
            }}
          >
            <h3
              className="font-heading font-bold text-2xl text-secondary-deep text-right"
              style={{ lineHeight: '1' }}
            >
              {t(titleKey)}
            </h3>
            <p
              className="text-secondary-deep text-xl text-right"
              style={{ lineHeight: '1', marginTop: '3px' }}
            >
              {t(descriptionKey)}
            </p>
          </div>
          <div
            className="flex items-end justify-end"
            style={{
              height: `${IMAGE_H - BLOCK_H}px`,
              paddingBottom: '10px',
              paddingRight: '10px',
            }}
          >
            <Link
              href={href}
              className="bg-primary text-white font-bold rounded text-center hover:bg-primary/90 transition-colors"
              style={{ width: '200px', padding: '9px 12px', lineHeight: '1' }}
            >
              <span className="text-xl font-bold" style={{ lineHeight: '1', display: 'block' }}>
                {t('resources.cta')}
              </span>
              <span className="font-bold text-sm" style={{ lineHeight: '1', display: 'block' }}>
                {t('resources.ctaSub')}
              </span>
            </Link>
          </div>
        </div>
        <div className="flex items-stretch" style={{ width: '45%' }}>
          <img
            src={image}
            alt={imageAlt}
            className="object-cover"
            style={{ width: '75%', height: '100%' }}
          />
          <div className="flex flex-col" style={{ width: '25%' }}>
            <div style={{ backgroundColor: '#A48EEF', width: '100%', height: `${BLOCK_H}px` }} />
            <div className="flex-1 bg-white" />
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col">
        <div
          className="flex flex-col items-end justify-center py-4"
          style={{ backgroundColor: '#CFC1FF', paddingLeft: '30%', paddingRight: '1rem' }}
        >
          <h3
            className="font-heading font-bold text-2xl text-secondary-deep text-right"
            style={{ lineHeight: '1' }}
          >
            {t(titleKey)}
          </h3>
          <p
            className="text-secondary-deep text-xl text-right"
            style={{ lineHeight: '1', marginTop: '3px' }}
          >
            {t(descriptionKey)}
          </p>
        </div>
        <div className="flex justify-end pr-4 py-3 bg-white">
          <Link
            href={href}
            className="bg-primary text-white font-bold rounded text-center hover:bg-primary/90 transition-colors"
            style={{ width: '200px', padding: '9px 12px', lineHeight: '1' }}
          >
            <span className="text-xl font-bold" style={{ lineHeight: '1', display: 'block' }}>
              {t('resources.cta')}
            </span>
            <span className="font-bold text-sm" style={{ lineHeight: '1', display: 'block' }}>
              {t('resources.ctaSub')}
            </span>
          </Link>
        </div>
        <img
          src={image}
          alt={imageAlt}
          className="w-full object-cover"
          style={{ maxHeight: '320px' }}
        />
      </div>
    </div>
  );
}

export default function ResourcesSection() {
  const t = useTranslations();

  const resources: ResourceItem[] = [
    {
      titleKey: 'resources.tools.title',
      descriptionKey: 'resources.tools.description',
      image: '/images/ResourcesSection2.png',
      imageAlt: t('resources.tools.imageAlt'),
      href: '/recursos/herramientas',
    },
    {
      titleKey: 'resources.blog.title',
      descriptionKey: 'resources.blog.description',
      image: '/images/ResourcesSection3.png',
      imageAlt: t('resources.blog.imageAlt'),
      href: '/blog',
    },
    {
      titleKey: 'resources.video.title',
      descriptionKey: 'resources.video.description',
      image: '/images/ResourcesSection4.png',
      imageAlt: t('resources.video.imageAlt'),
      href: '/recursos/videos',
    },
  ];

  return (
    <>
      <Reveal
        variant="slide-right"
        className="flex flex-col md:flex-row w-full min-h-[220px] md:min-h-[260px]"
      >
        <div className="relative w-full md:w-[58%] overflow-hidden min-h-[140px] md:min-h-full">
          <img
            src="/images/ResourcesSection1.png"
            alt={t('resources.hero.imageAlt')}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div
            className="hidden md:block absolute left-0 bg-primary opacity-65"
            aria-hidden="true"
            style={{ top: '50%', transform: 'translateY(-50%)', width: '44%', height: '44%' }}
          />
          <div
            className="hidden md:block absolute"
            aria-hidden="true"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              left: '62%',
              height: '44%',
              aspectRatio: '1 / 1',
              backgroundColor: '#7210F2',
              opacity: 0.9,
            }}
          />
          <div
            className="md:hidden absolute top-0 left-0 bg-primary opacity-60"
            aria-hidden="true"
            style={{ width: '80%', height: '38%' }}
          />
          <div
            className="md:hidden absolute bottom-0 left-0"
            aria-hidden="true"
            style={{ width: '80%', height: '38%', backgroundColor: '#7210F2', opacity: 0.55 }}
          />
        </div>
        <div
          className="w-full md:w-[42%] flex items-center px-12 py-16 md:py-10 md:px-14"
          style={{ backgroundColor: '#7210F2' }}
        >
          <p className="text-white text-3xl md:text-4xl font-sans" style={{ lineHeight: '1.02' }}>
            {t('resources.hero.textStart')}{' '}
            <strong className="font-bold">{t('resources.hero.textBold')}</strong>{' '}
            {t('resources.hero.textEnd')}
          </p>
        </div>
      </Reveal>

      <section className="w-full md:px-8 py-2 md:max-w-6xl md:mx-auto">
        <div className="hidden md:flex items-center mb-4">
          <div style={{ width: '55%', paddingLeft: '20%', paddingRight: '3rem' }}>
            <p
              className="font-heading font-bold text-2xl text-secondary-deep text-right"
              style={{ lineHeight: '1.1' }}
            >
              {t('resources.intro.question')}
            </p>
          </div>
          <div style={{ width: '45%' }} className="pl-4 flex items-center">
            <p
              className="text-2xl text-secondary-deep"
              style={{ lineHeight: '1.1', paddingRight: '40%' }}
            >
              {t('resources.intro.answer')}
            </p>
          </div>
        </div>

        <div className="md:hidden flex flex-col pt-3 pb-2">
          <p
            className="font-heading font-bold text-xl text-secondary-deep text-right"
            style={{ lineHeight: '1.1', paddingLeft: '10%', paddingRight: '40%', width: '100%' }}
          >
            {t('resources.intro.question')}
          </p>
          <p
            className="text-xl text-secondary-deep text-left"
            style={{
              lineHeight: '1.15',
              paddingLeft: '0.75rem',
              paddingTop: '0.5rem',
              paddingRight: '62%',
            }}
          >
            {t('resources.intro.answer')}
          </p>
        </div>

        {resources.map((resource, index) => (
          <Reveal key={resource.titleKey} variant="fade-up" delay={index * 0.08}>
            <ResourceCard {...resource} t={t} />
          </Reveal>
        ))}
      </section>
    </>
  );
}
