import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/app/components/ui/Reveal';

const fontHeebo = 'var(--font-heebo), Heebo, sans-serif';
const fontRoboto = 'var(--font-roboto), Roboto, sans-serif';

export default function JoinSection() {
  const t = useTranslations('join');
  return (
    <section style={{ background: '#ffffff', width: '100%' }}>
      {/* Mobile layout */}
      <div className="lg:hidden">
        {/* Photo */}
        <Reveal
          variant="fade"
          style={{
            borderLeft: '7px solid #7210f1',
            height: 566,
            width: '100%',
            position: 'relative',
          }}
        >
          <Image
            src="/images/home-members.avif"
            alt="Miembros de SIGUE Network"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </Reveal>

        {/* Decorative rectangles */}
        <Reveal
          variant="fade-up"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              background: '#ef1351',
              marginBottom: 15,
              marginTop: 25,
            }}
          />
          <div style={{ width: 100, height: 236, background: '#502076' }} />
        </Reveal>

        {/* Text */}
        <Reveal variant="slide-right" style={{ padding: 24 }}>
          <h2
            style={{
              fontFamily: fontHeebo,
              fontSize: 39,
              fontWeight: 900,
              color: '#EF1351',
              marginBottom: 16,
              marginTop: 0,
            }}
          >
            {t('title')}
          </h2>
          <p
            style={{
              fontFamily: fontHeebo,
              fontSize: 20,
              color: '#502076',
              textAlign: 'justify',
              margin: 0,
            }}
          >
            {t('p1')}
            <strong style={{ fontWeight: 700 }}>{t('p1Bold1')}</strong>
            {t('p1Mid')}
            <strong style={{ fontWeight: 700 }}>{t('p1Bold2')}</strong>
            {t('p1End')}
            <strong style={{ fontWeight: 700 }}>{t('p1Bold3')}</strong>
            {t('p1End2')}
            <strong style={{ fontWeight: 700 }}>{t('p1Bold4')}</strong>.
          </p>
        </Reveal>

        {/* Button */}
        <div
          style={{
            background: '#ffffff',
            height: 89,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Reveal variant="fade-up" className="flex w-full justify-center">
            <Link
              href="/miembros-sigue"
              style={{
                width: 410,
                maxWidth: '100%',
                height: 69,
                background: '#ef1351',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
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
                  fontFamily: fontRoboto,
                  fontSize: 17,
                  fontWeight: 400,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                {t('ctaSub')}
              </span>
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block">
        {/* Top row — 3 columns */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
          {/* Column 1 — photo */}
          <Reveal
            variant="fade"
            style={{
              width: 425,
              height: 567,
              borderLeft: '26px solid #7210f1',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/home-members.avif"
              alt="Miembros de SIGUE Network"
              fill
              sizes="425px"
              style={{ objectFit: 'cover' }}
            />
          </Reveal>

          {/* Column 2 — decorative rectangles */}
          <Reveal
            variant="fade-up"
            delay={0.08}
            style={{
              width: 136,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: 25,
              marginLeft: 30,
              gap: 15,
            }}
          >
            <div style={{ width: 136, height: 136, background: '#ef1351' }} />
            <div style={{ width: 136, height: 348, background: '#502076' }} />
          </Reveal>

          {/* Column 3 — text */}
          <Reveal variant="slide-right" delay={0.12} style={{ flex: 1, padding: 40 }}>
            <h2
              style={{
                fontFamily: fontHeebo,
                fontSize: 50,
                fontWeight: 600,
                color: '#EF1351',
                marginBottom: 16,
                marginTop: 0,
                marginRight: 60,
                lineHeight: 1.1,
              }}
            >
              {t('titleStart')}
              <strong style={{ fontWeight: 700 }}>{t('titleBold')}</strong>
            </h2>
            <p
              style={{
                fontFamily: fontHeebo,
                fontSize: 30,
                color: '#502076',
                textAlign: 'justify',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {t('p1')}
              <strong style={{ fontWeight: 700 }}>{t('p1Bold1')}</strong>
              {t('p1Mid')}
              <strong style={{ fontWeight: 700 }}>{t('p1Bold2')}</strong>
              {t('p1End')}
              <strong style={{ fontWeight: 700 }}>{t('p1Bold3')}</strong>
              {t('p1End2')}
              <strong style={{ fontWeight: 700 }}>{t('p1Bold4')}</strong>.
            </p>
          </Reveal>
        </div>

        {/* Bottom row — button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 89,
          }}
        >
          <Reveal variant="fade-up">
            <Link
              href="/miembros-sigue"
              style={{
                width: 280,
                height: 86,
                background: '#ef1351',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
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
                  fontFamily: fontRoboto,
                  fontSize: 17,
                  fontWeight: 400,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                {t('ctaSub')}
              </span>
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Bottom separator */}
      <div style={{ background: '#ffffff', height: 100, width: '100%' }} />
    </section>
  );
}
