import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Reveal from '@/app/components/ui/Reveal';

const fontHeebo = 'var(--font-heebo), Heebo, sans-serif';
const fontRoboto = 'var(--font-roboto), Roboto, sans-serif';

export default function InfoSection() {
  const t = useTranslations('info');
  return (
    <section style={{ width: '100%' }}>
      {/* Top strip — mobile only */}
      <div className="lg:hidden" style={{ height: 60, background: '#e2e3ff' }} />

      {/* Top strip — desktop only */}
      <div className="hidden lg:block" style={{ height: 203, background: '#e2e3ff' }} />

      {/* Main red block */}
      <div
        className="px-[58px] lg:flex lg:flex-row lg:items-stretch lg:h-[500px] lg:pl-[12vw] lg:pr-[4vw]"
        style={{ background: '#ef1351', width: '100%' }}
      >
        {/* Purple block */}
        <Reveal
          variant="fade-up"
          className="w-[314px] h-[621px] mx-auto lg:w-[380px] lg:h-[500px] lg:mx-0 lg:shrink-0"
          style={{ padding: '50px 15px', background: '#502076', position: 'relative' }}
        >
          {/* Red decorative rectangle */}
          <div
            aria-hidden="true"
            className="absolute top-[50px] left-[15px] w-[100px] h-[100px] lg:w-[124px]"
            style={{ background: '#ef1351' }}
          />
          {/* White decorative rectangle */}
          <div
            aria-hidden="true"
            className="absolute top-[170px] left-[15px] w-[100px] h-[250px] lg:w-[124px]"
            style={{ background: '#ffffff' }}
          />
          {/* SIGUE / Network — absolute on mobile, relative on desktop */}
          <div
            className="absolute top-[440px] left-[15px] lg:absolute lg:top-[75px] lg:left-[195px]"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}
          >
            <p
              style={{
                fontFamily: fontRoboto,
                fontSize: 60,
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1,
              }}
            >
              SIGUE
            </p>
            <p
              style={{
                fontFamily: fontRoboto,
                fontSize: 31,
                fontWeight: 400,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Network
            </p>
          </div>
        </Reveal>

        {/* Text content */}
        <Reveal
          variant="fade-down"
          delay={0.08}
          className="py-[14px] lg:w-[700px] lg:self-center lg:py-0 lg:pl-[20px]"
        >
          <h2
            style={{
              fontFamily: fontRoboto,
              fontSize: 36,
              fontWeight: 600,
              color: '#ffffff',
              margin: '0 0 16px 0',
              lineHeight: 1.05,
            }}
          >
            {t('title')}
          </h2>
          <p
            style={{
              fontFamily: fontRoboto,
              fontSize: 24,
              color: '#ffffff',
              marginBottom: 18,
              lineHeight: 1.15,
              textAlign: 'justify',
            }}
          >
            {t('p1')} <strong style={{ fontWeight: 700 }}>{t('p1Bold')}</strong>.
          </p>
          <p
            style={{
              fontFamily: fontHeebo,
              fontSize: 24,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.15,
              marginBottom: 10,
              textAlign: 'justify',
            }}
          >
            {t('p2')} <strong style={{ fontWeight: 700 }}>{t('p2Bold1')}</strong> {t('p2Mid')}{' '}
            <strong style={{ fontWeight: 700 }}>{t('p2Bold2')}</strong>
            {t('p2End')}
          </p>
        </Reveal>
      </div>

      {/* White strip with button */}
      <div
        style={{
          height: 90,
          background: '#e2e3ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Reveal variant="fade-up" className="flex w-full justify-center">
          <Link
            href="/sigue-tracks"
            className="w-[410px] h-[69px] lg:w-[280px] lg:h-[86px] lg:mt-5"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#ef1351',
              justifyContent: 'center',
              padding: '12px 24px',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: fontRoboto,
                fontSize: 28,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
              }}
            >
              {t('cta')}
            </span>
            <span
              style={{
                display: 'flex',
                fontFamily: fontRoboto,
                fontSize: 17,
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: 1,
                alignItems: 'center',
              }}
            >
              {t('ctaSub')}
            </span>
          </Link>
        </Reveal>
      </div>

      {/* Bottom strip */}
      <div style={{ height: 100, background: '#e2e3ff' }} />
    </section>
  );
}
