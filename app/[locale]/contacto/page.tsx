import { useTranslations } from 'next-intl';
import PageHero from '@/app/components/ui/PageHero';
import Reveal from '@/app/components/ui/Reveal';
import SocialLinks from '@/app/components/ui/SocialLinks';

export default function ContactoPage() {
  const t = useTranslations('contactPage');

  return (
    <main className="overflow-x-hidden">
      <PageHero
        imageSrc="/images/contact-hero.jpg"
        imageAlt={t('hero.imageAlt')}
        badge={t('hero.badge')}
        strongOverlay
        titleClassName="lg:text-[36px]"
        title={<>“{t('hero.title')}”</>}
      />

      <section className="bg-white px-6 py-16 md:py-20 lg:py-24">
        <Reveal variant="fade-up" className="mx-auto max-w-6xl">
          <h2 className="font-heading text-3xl font-black text-black md:text-4xl">
            {t('details.title')}
          </h2>

          <div className="mt-14 space-y-7 font-sans text-lg text-black md:text-xl">
            <p>
              <strong>{t('details.emailLabel')}</strong>{' '}
              <a
                href="mailto:info@siguenetwork.org"
                className="font-bold text-primary transition-colors hover:text-secondary"
              >
                info@siguenetwork.org
              </a>
            </p>
            <p>
              <strong>{t('details.addressLabel')}</strong> {t('details.address')}
            </p>
          </div>

          <SocialLinks className="mt-14" />
        </Reveal>
      </section>
    </main>
  );
}
