import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, GraduationCap, HeartHandshake } from 'lucide-react';
import Reveal from '@/app/components/ui/Reveal';
import SiteHeader2026 from '@/app/components/site-2026/SiteHeader2026';
import { absoluteUrl } from '@/lib/site-url';
import { conoceContent, type ConoceLocale } from './content';
import styles from './ConoceLanding.module.css';

function localizedHref(locale: ConoceLocale, href: string) {
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return href;
  return `/${locale}${href}`;
}

function ActionLink({ locale, href, children, secondary = false }: {
  locale: ConoceLocale;
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  const external = href.startsWith('http');
  return (
    <Link
      className={`${styles.actionLink} ${secondary ? styles.actionLinkSecondary : ''}`}
      href={localizedHref(locale, href)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </Link>
  );
}

function DecorativeHeading({ title, accent, subtitle }: { title: string; accent: string; subtitle?: string }) {
  return (
    <div className={styles.decorativeHeading}>
      <span className={styles.decorativeFrame} aria-hidden="true" />
      <div>
        <h2>{title} <em>{accent}</em></h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ConoceLanding({ locale }: { locale: ConoceLocale }) {
  const c = conoceContent[locale];
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'SIGUE Network',
    url: absoluteUrl(`/${locale}/conoce-sigue`),
    logo: absoluteUrl('/images/home-2026/logo-transparent.png'),
    founder: { '@type': 'Person', name: 'Sandra Prieto', url: 'https://sandraprieto.org' },
    email: 'info@siguenetwork.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3913 Griese Lane',
      addressLocality: 'Grovetown',
      addressRegion: 'GA',
      postalCode: '30813',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.instagram.com/siguenetwork/',
      'https://www.facebook.com/people/SIGUE-Network/61566310019607/',
      'https://www.linkedin.com/company/sigue-network/',
      'https://www.youtube.com/@SIGUENetwork',
    ],
  };

  return (
    <div data-conoce-2026 className={styles.page}>
      <a className={styles.skipLink} href="#contenido-conoce">{c.skip}</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <SiteHeader2026 locale={locale} localePath="/conoce-sigue" />

      <div id="contenido-conoce">
        <section id="inicio" className={styles.hero} aria-labelledby="conoce-hero-title">
          <Image src="/images/conoce-2026/hero.webp" alt={c.hero.imageAlt} fill priority sizes="100vw" />
          <div className={styles.heroShade} aria-hidden="true" />
          <Reveal className={styles.heroPanel} variant="slide-right" amount={0.2}>
            <h1 id="conoce-hero-title">
              <strong>{c.hero.title[0]}</strong>
              <span>{c.hero.title[1]}</span>
              <strong>{c.hero.title[2]}</strong>
              <span>{c.hero.title[3]}</span>
            </h1>
            <ActionLink locale={locale} href="#urgencia">{c.hero.cta}</ActionLink>
          </Reveal>
        </section>

        <section id="urgencia" className={styles.urgency} aria-labelledby="urgency-title">
          <div className={styles.container}>
            <Reveal>
              <p className={styles.eyebrow}>{c.urgency.eyebrow}</p>
              <h2 id="urgency-title" className={styles.displayTitle}>{c.urgency.title} <em>{c.urgency.accent}</em></h2>
            </Reveal>
            <div className={styles.statsGrid}>
              {c.urgency.stats.map(([value, label], index) => (
                <Reveal className={styles.statPill} key={label} delay={index * 0.04}>
                  <strong>{value}</strong><span>{label}</span>
                </Reveal>
              ))}
            </div>
            <div className={styles.urgencyCopy}>
              {c.urgency.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <ActionLink locale={locale} href="#barreras">{c.urgency.cta}</ActionLink>
          </div>
        </section>

        <section id="barreras" className={styles.barriers} aria-labelledby="barriers-title">
          <div className={styles.container}>
            <div className={styles.barriersTop}>
              <Reveal className={styles.barriersLead} variant="slide-left">
                <p className={styles.eyebrow}>{c.barriers.eyebrow}</p>
                <h2 id="barriers-title">{c.barriers.title} <em>{c.barriers.accent}</em></h2>
                <strong className={styles.survival}>{c.barriers.survival}</strong>
                <p>{c.barriers.note}</p>
              </Reveal>
              <div className={styles.barrierList}>
                {c.barriers.items.map(([title, body], index) => (
                  <Reveal className={styles.barrierCard} key={title} variant="slide-right" delay={index * 0.05}>
                    <h3>{title}</h3><p>{body}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.resourcesBarrier}>
            <div className={styles.container}>
              <div className={styles.resourcesCopy}>
                <h3>{c.barriers.resourcesTitle}</h3>
                <p>{c.barriers.resourcesBody}</p>
                <div className={styles.resourceStats}>
                  {c.barriers.resources.map(([value, label]) => (
                    <div key={value}><strong>{value}</strong><span>{label}</span></div>
                  ))}
                </div>
                <p>{c.barriers.closing}</p>
              </div>
              <Image
                className={styles.latinMap}
                src="/images/conoce-2026/latin-america-map.webp"
                alt=""
                width={553}
                height={631}
                sizes="(max-width: 800px) 88vw, 42vw"
                aria-hidden="true"
              />
            </div>
            <ActionLink locale={locale} href="#respuesta">{c.barriers.cta}</ActionLink>
          </div>
        </section>

        <section id="respuesta" className={styles.response} aria-labelledby="response-title">
          <div className={styles.container}>
            <DecorativeHeading title={c.response.title} accent={c.response.accent} />
            <Reveal className={styles.responseStatement}>
              <p id="response-title">{c.response.statement}</p>
              <div className={styles.formula}><strong>{c.response.formula[0]}</strong><span>+</span><strong>{c.response.formula[1]}</strong></div>
            </Reveal>
          </div>
          <div className={styles.responseFeature}>
            <blockquote>{c.response.quote}</blockquote>
            <div className={styles.responseImage}>
              <Image src="/images/conoce-2026/response.webp" alt={c.response.imageAlt} fill sizes="(max-width: 800px) 100vw, 50vw" />
            </div>
          </div>
          <div className={`${styles.container} ${styles.benefitsGrid}`}>
            {c.response.benefits.map(([title, body]) => (
              <div className={styles.benefit} key={title}><span aria-hidden="true" /><p><strong>{title}</strong> {body}</p></div>
            ))}
          </div>
          <ActionLink locale={locale} href="#esencia">{c.response.cta}</ActionLink>
        </section>

        <section id="esencia" className={styles.essence} aria-labelledby="essence-title">
          <div className={styles.essenceHeader}>
            <div className={styles.essenceImage}>
              <Image src="/images/conoce-2026/essence.webp" alt={c.essence.imageAlt} fill sizes="(max-width: 760px) 100vw, 42vw" />
              <span aria-hidden="true" />
            </div>
            <div><h2 id="essence-title">{c.essence.title} <em>{c.essence.accent}</em></h2><p>{c.essence.subtitle}</p></div>
          </div>
          <div className={`${styles.container} ${styles.essenceGrid}`}>
            {c.essence.items.map(([title, lead, body], index) => (
              <Reveal className={styles.essenceCard} key={title} delay={index * 0.06}>
                <span aria-hidden="true" />
                <div><h3>{title}</h3><p><strong>{lead}</strong> {body}</p></div>
              </Reveal>
            ))}
          </div>
          <ActionLink locale={locale} href="#enfoque">{c.essence.cta}</ActionLink>
        </section>

        <section id="enfoque" className={styles.theory} aria-labelledby="theory-title">
          <div className={styles.container}>
            <p className={styles.eyebrow}>{c.theory.eyebrow}</p>
            <p id="theory-title" className={styles.theoryIntro}>{c.theory.intro}</p>
          </div>
          <div className={styles.theoryGrid}>
            <div className={`${styles.theoryColumn} ${styles.theoryChallenge}`}>
              <h3>{c.theory.challenge.title}</h3>
              <strong>{c.theory.challenge.lead}</strong>
              <ul>{c.theory.challenge.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <ArrowRight className={styles.theoryArrow} aria-hidden="true" />
            <div className={`${styles.theoryColumn} ${styles.theorySolution}`}>
              <h3>{c.theory.solution.title}</h3>
              <strong>{c.theory.solution.formula}</strong>
              {c.theory.solution.groups.map(([title, items]) => (
                <div className={styles.theoryGroup} key={title}><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
              ))}
            </div>
            <ArrowRight className={styles.theoryArrow} aria-hidden="true" />
            <div className={`${styles.theoryColumn} ${styles.theoryTransformation}`}>
              <h3>{c.theory.transformation.title}</h3>
              {c.theory.transformation.groups.map(([title, items]) => (
                <div className={styles.theoryGroup} key={title}><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
              ))}
            </div>
          </div>
        </section>

        <section id="corazon" className={styles.heart} aria-labelledby="heart-title">
          <div className={styles.heartHero}>
            <Image src="/images/conoce-2026/heart.webp" alt={c.heart.imageAlt} fill sizes="100vw" />
            <p className={styles.eyebrow}>{c.heart.eyebrow}</p>
          </div>
          <div className={styles.container}>
            <h2 id="heart-title" className={styles.displayTitle}>{c.heart.title} <em>{c.heart.accent}</em></h2>
            <div className={styles.fourRLayout}>
              <blockquote>{c.heart.intro}</blockquote>
              <div><h3>{c.heart.fourRTitle}</h3>{c.heart.fourR.map(([title, body]) => (
                <div className={styles.fourRItem} key={title}><span aria-hidden="true" /><p><strong>{title}</strong>{body}</p></div>
              ))}</div>
            </div>
          </div>
          <div className={styles.whyBand}>
            <Image src="/images/home-2026/logo-transparent.png" alt="" width={90} height={108} />
            <div><h3>{c.heart.why}</h3><p>{c.heart.whyBody}</p></div>
          </div>
          <div className={styles.valuesSection}>
            <div className={styles.valuesGrid}>
              {c.heart.values.map(([letter, title, body], index) => (
                <Reveal className={styles.valueCard} key={letter} delay={index * 0.05}>
                  <strong>{letter}</strong><h3>{title}</h3><p>{body}</p>
                </Reveal>
              ))}
            </div>
            <p>{c.heart.valuesClosing}</p>
            <ActionLink locale={locale} href="#portafolio">{c.heart.cta}</ActionLink>
          </div>
        </section>

        <section id="portafolio" className={styles.portfolio} aria-labelledby="portfolio-title">
          <div className={styles.portfolioIntro}>
            <p className={styles.eyebrow}>{c.portfolio.eyebrow}</p>
            <h2 id="portfolio-title">{c.portfolio.title} <em>{c.portfolio.accent}</em></h2>
            <p>{c.portfolio.intro}</p>
          </div>
          <div className={styles.portfolioImage}><Image src="/images/conoce-2026/portfolio.webp" alt={c.portfolio.imageAlt} fill sizes="100vw" /></div>
          <p className={styles.mobileHint}>{locale === 'es' ? 'Desliza para ver más →' : 'Swipe to see more →'}</p>
          <div className={styles.portfolioRail}>
            {c.portfolio.cards.map(([kicker, logo, logoAlt, question, body, cta, href], index) => (
              <Reveal className={styles.portfolioCard} key={logoAlt} delay={index * 0.05}>
                <span>{kicker}</span>
                <div className={styles.portfolioLogo}><Image src={logo} alt={logoAlt} fill sizes="200px" /></div>
                <h3>{question}</h3><p>{body}</p>
                <ActionLink locale={locale} href={href} secondary>{cta}</ActionLink>
              </Reveal>
            ))}
          </div>
          <div className={styles.assessment}>
            <p className={styles.eyebrow}>{c.portfolio.assessmentEyebrow}</p>
            <em>{c.portfolio.assessmentLead}</em><h3>{c.portfolio.assessmentTitle}</h3><p>{c.portfolio.assessmentBody}</p>
            <ActionLink locale={locale} href="/contacto">{c.portfolio.assessmentCta}</ActionLink>
          </div>
        </section>

        <section id="historia" className={styles.history} aria-labelledby="history-title">
          <div className={styles.container}>
            <DecorativeHeading title={c.history.title} accent={c.history.accent} subtitle={c.history.intro} />
            <div className={styles.historyLayout}>
              <div className={styles.historyGallery}>
                <div><Image src="/images/conoce-2026/history-2010.webp" alt={c.history.firstImageAlt} fill sizes="(max-width: 800px) 100vw, 38vw" /></div>
                <div><Image src="/images/conoce-2026/history-2018.webp" alt={c.history.secondImageAlt} fill sizes="(max-width: 800px) 100vw, 38vw" /></div>
                <ActionLink locale={locale} href="https://www.youtube.com/@SIGUENetwork">{c.history.cta}</ActionLink>
              </div>
              <ol className={styles.timeline}>
                {c.history.items.map(([year, title, body]) => (
                  <li key={year}><span>{year}</span><div><h3>{title}</h3><p>{body}</p></div></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="sandra-prieto" className={styles.founder} aria-labelledby="founder-title">
          <div className={styles.founderImage}>
            <Image src="/images/conoce-2026/founder-sandra-prieto.webp" alt={c.founder.imageAlt} fill sizes="(max-width: 800px) 100vw, 43vw" />
            <strong>{c.founder.role}</strong>
          </div>
          <div className={styles.founderCopy}>
            <h2 id="founder-title">{c.founder.title} <em>{c.founder.name}</em></h2>
            <blockquote>{c.founder.quote}</blockquote>
            {c.founder.sections.map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}
            <ActionLink locale={locale} href="https://sandraprieto.org">{c.founder.cta}</ActionLink>
          </div>
        </section>

        <section id="equipo" className={styles.team} aria-labelledby="team-title">
          <div className={styles.container}>
            <DecorativeHeading title={c.team.title} accent={c.team.accent} subtitle={c.team.subtitle} />
            <h3 id="team-title">{c.team.boardTitle}</h3>
            <div className={styles.boardGrid}>
              {c.team.board.map(([name, role, image]) => (
                <article className={styles.person} key={name}><div><Image src={`/images/conoce-2026/${image}`} alt={name} fill sizes="220px" /></div><h4>{name}</h4><p>{role}</p></article>
              ))}
            </div>
            <h3>{c.team.volunteerTitle}</h3>
            <div className={styles.volunteerGrid}>
              {c.team.volunteers.map(([name, image]) => (
                <article className={styles.person} key={name}><div><Image src={`/images/conoce-2026/${image}`} alt={name} fill sizes="180px" /></div><h4>{name}</h4></article>
              ))}
            </div>
          </div>
        </section>

        <section id="sumate" className={styles.join} aria-labelledby="join-title">
          <div className={styles.container}>
            <DecorativeHeading title={c.join.title} accent={c.join.accent} subtitle={c.join.subtitle} />
            <div className={styles.joinGrid}>
              {c.join.options.map(([title, meta, body, areas, cta], index) => {
                const Icon = index === 0 ? HeartHandshake : GraduationCap;
                return (
                  <Reveal className={styles.joinCard} key={title} delay={index * 0.08}>
                    <div className={styles.joinTitle}><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{meta}</p></div></div>
                    <p>{body}</p><ul>{areas.map((area) => <li key={area}>{area}</li>)}</ul>
                    <ActionLink locale={locale} href="/unete">{cta}</ActionLink>
                  </Reveal>
                );
              })}
            </div>
          </div>
          <div className={styles.process}>
            <div><h3>{c.join.processTitle}</h3><p>{c.join.processSubtitle}</p></div>
            <ol>{c.join.process.map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>)}</ol>
          </div>
        </section>

        <section id="recursos" className={styles.resources} aria-labelledby="resources-title">
          <div className={styles.resourcesImage}>
            <Image src="/images/conoce-2026/resources.webp" alt={c.resources.imageAlt} fill sizes="100vw" />
            <span aria-hidden="true" />
          </div>
          <div className={styles.container}>
            <h2 id="resources-title">{c.resources.title} <em>{c.resources.accent}</em></h2><p>{c.resources.subtitle}</p>
            <div className={styles.resourceCards}>
              {c.resources.items.map(([title, body, cta, href]) => (
                <article key={title}><BriefcaseBusiness aria-hidden="true" /><h3>{title}</h3><p>{body}</p><ActionLink locale={locale} href={href} secondary>{cta} <ArrowRight size={18} aria-hidden="true" /></ActionLink></article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div><h2>SIGUE NETWORK</h2><p>{c.footer.body}</p><small>501(C)(3) · EIN: 26-2010006<br />3913 GRIESE LANE, GROVETOWN, GA 30813<br /><a href="mailto:info@siguenetwork.org">INFO@SIGUENETWORK.ORG</a></small></div>
          <nav aria-label={c.footer.discover}><strong>{c.footer.discover}</strong><Link href={`/${locale}/inicio-2026`}>{locale === 'es' ? 'Inicio' : 'Home'}</Link><Link href={`/${locale}/conoce-sigue`}>{locale === 'es' ? 'Conoce SIGUE' : 'About SIGUE'}</Link><Link href={`/${locale}/sigue-tracks`}>SIGUE Tracks</Link><Link href={`/${locale}/sigue-consulting`}>Consulting</Link><Link href={`/${locale}/sigue-hub`}>SIGUE Hub</Link></nav>
          <nav aria-label={c.footer.participate}><strong>{c.footer.participate}</strong><Link href={`/${locale}/unete`}>{locale === 'es' ? 'Únete' : 'Join'}</Link><Link href={`/${locale}/contacto`}>{locale === 'es' ? 'Contáctanos' : 'Contact us'}</Link><Link href={`/${locale}/donacion`}>{locale === 'es' ? 'Donación' : 'Donate'}</Link><Link href={`/${locale}/unete`}>{locale === 'es' ? 'Voluntariado' : 'Volunteer'}</Link></nav>
        </div>
        <div className={styles.footerBottom}><p>{c.footer.rights}</p><nav aria-label="Social media"><a href="https://www.instagram.com/siguenetwork/" target="_blank" rel="noreferrer">INSTAGRAM</a><a href="https://www.facebook.com/people/SIGUE-Network/61566310019607/" target="_blank" rel="noreferrer">FACEBOOK</a><a href="https://www.linkedin.com/company/sigue-network/" target="_blank" rel="noreferrer">LINKEDIN</a><a href="https://www.youtube.com/@SIGUENetwork" target="_blank" rel="noreferrer">YOUTUBE</a></nav></div>
      </footer>
    </div>
  );
}
