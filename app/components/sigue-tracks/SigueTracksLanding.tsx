import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './SigueTracksLanding.module.css';

type Locale = 'es' | 'en';

const trackLinks = ['/sigue-consulting', '/sigue-academy', '/sigue-hub'] as const;
const trackImages = [
  '/images/sigueTracksCard1.png',
  '/images/sigueTracksCard2.png',
  '/images/sigueTracksCard3.png',
] as const;

function AssessmentLink({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  return (
    <Link
      className={`${styles.actionButton} ${compact ? styles.actionButtonCompact : ''}`}
      href={`/${locale}/contacto?motivo=autoevaluacion`}
    >
      <strong>{locale === 'es' ? 'SOLICITA TU' : 'REQUEST AN'}</strong>
      <span>{locale === 'es' ? 'AUTOEVALUACIÓN' : 'ASSESSMENT'}</span>
    </Link>
  );
}

export default function SigueTracksLanding({ locale }: { locale: Locale }) {
  const t = useTranslations('sigueTracksPage');

  const tracks = trackLinks.map((href, index) => ({
    href,
    image: trackImages[index],
    title: t(`trackCards.items.${index}.cardTitle`),
    subtitle: t(`trackCards.items.${index}.cardSubTitle`),
    body: t(`trackCards.items.${index}.cardBody`),
    buttonLead: t(`trackCards.items.${index}.btnLabel`),
    buttonLabel: t(`trackCards.items.${index}.btnSubLabel`),
    imageAlt: t(`trackCards.items.${index}.imageAlt`),
  }));

  return (
    <div className={styles.page} data-sigue-tracks-page>
      <section className={styles.hero} aria-labelledby="tracks-title">
        <Image
          src="/images/sigue_tracks_banner.jpg"
          alt={t('banner.imageAlt')}
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroPanel}>
          <span className={styles.heroGlass} aria-hidden="true" />
          <span className={styles.heroSquare} aria-hidden="true" />
          <div>
            <h1 id="tracks-title"><strong>{t('banner.badgeLine1')}</strong> {t('banner.badgeLine2')}</h1>
            <p>{t('banner.badgeLine3')}<br />{t('banner.badgeLine4')}<br />{t('banner.badgeLine5')}</p>
          </div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="tracks-intro-title">
        <div className={styles.introCopy}>
          <div>
            <h2 id="tracks-intro-title">{t('intro.introLine1')}</h2>
            <p>{t('intro.introLine2')}</p>
            <p><strong>{t('intro.introLine3_bold')}</strong> {t('intro.introLine3_regular')}</p>
            <p>{t('intro.introLine4')}</p>
          </div>
        </div>
        <div className={styles.introAction}><AssessmentLink locale={locale} /></div>
      </section>

      <section className={styles.routesIntro} aria-labelledby="tracks-routes-title">
        <div className={styles.geometry} aria-hidden="true">
          <span className={styles.geometryBar} />
          <span className={styles.geometrySquare} />
        </div>
        <div className={styles.routesCopy}>
          <h2 id="tracks-routes-title">
            {t('creamos.line1')} <strong>{t('creamos.line1_bold')}</strong>
          </h2>
          <p><strong>{t('creamos.line2_bold')}</strong> {t('creamos.line2')}</p>
          <p>{t('creamos.line3')}</p>
          <p>{t('creamos.line4')}</p>
          <p>{t('creamos.line5')}</p>
          <p>{t('creamos.line6')}</p>
          <p>{t('creamos.line7')}</p>
        </div>
      </section>

      <section className={styles.tracksSection} aria-label={locale === 'es' ? 'Rutas SIGUE' : 'SIGUE routes'}>
        <div className={styles.tracksGrid}>
          {tracks.map((track) => (
            <article className={styles.track} key={track.href}>
              <div className={styles.trackCard}>
                <div className={styles.trackImage}>
                  <Image src={track.image} alt={track.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" />
                </div>
                <div className={styles.trackContent}>
                  <h2>{track.title}</h2>
                  <h3>{track.subtitle}</h3>
                  <p>{track.body}</p>
                </div>
              </div>
              <Link className={styles.actionButton} href={`/${locale}${track.href}`}>
                <strong>{track.buttonLead}</strong>
                <span>{track.buttonLabel}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.assessment} aria-labelledby="assessment-title">
        <div className={styles.assessmentVisual} aria-hidden="true">
          <span className={styles.assessmentBlock} />
          <div className={styles.assessmentQuestion}>
            <strong>{locale === 'es' ? '¿No' : 'Not sure'}</strong>
            <span>{locale === 'es' ? 'sabes por' : 'where to'}</span>
            <strong>{locale === 'es' ? 'dónde' : 'start'}</strong>
            {locale === 'es' ? <strong>empezar?</strong> : null}
          </div>
        </div>
        <p id="assessment-title">
          {locale === 'es' ? 'Realiza nuestra ' : 'Complete our '}
          <strong>{locale === 'es' ? 'AUTOEVALUACIÓN – SIGUE SCALE-UP FRAMEWORK™' : 'SELF-ASSESSMENT – SIGUE SCALE-UP FRAMEWORK™'}</strong>
          {locale === 'es' ? ' y descubre la combinación ideal para ti' : ' and discover the ideal combination for you'}
        </p>
      </section>
      <div className={styles.assessmentAction}><AssessmentLink locale={locale} compact /></div>
    </div>
  );
}
