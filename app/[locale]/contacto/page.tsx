import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PageHero from '@/app/components/ui/PageHero';
import Reveal from '@/app/components/ui/Reveal';
import SocialLinks from '@/app/components/ui/SocialLinks';
import DynamicForm from '@/app/components/forms/DynamicForm';
import { getPublishedDynamicForm } from '@/lib/forms/public';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const title = locale === 'en' ? 'Contact SIGUE Network' : 'Contacto | SIGUE Network';
  const description = locale === 'en'
    ? 'Contact SIGUE Network to learn about membership, partnerships, volunteering, and our programs.'
    : 'Contacta a SIGUE Network para conocer la membresía, las alianzas, el voluntariado y nuestros programas.';
  const canonical = absoluteUrl(`/${locale}/contacto`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { es: absoluteUrl('/es/contacto'), en: absoluteUrl('/en/contacto') },
    },
    openGraph: { type: 'website', title, description, url: canonical, siteName: 'SIGUE Network' },
  };
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'en' ? 'en' : 'es';
  const t = await getTranslations('contactPage');
  const contactForm = await getPublishedDynamicForm('contacto');

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
          {contactForm ? <div className="mt-14"><DynamicForm {...contactForm} locale={locale} sourcePath={`/${locale}/contacto`} /></div> : null}
        </Reveal>
      </section>
    </main>
  );
}
