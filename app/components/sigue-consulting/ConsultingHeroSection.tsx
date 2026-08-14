import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LinkButton from '@/app/components/ui/LinkButton';

export default function HeroSection() {
  const t = useTranslations('sigueConsulting.hero');

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[420px] md:min-h-[520px] lg:min-h-[620px] xl:min-h-[700px] overflow-hidden">
      <Image
        src="/images/ConsultingHeroSection.jpg"
        alt={t('imageAlt')}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="relative z-10 flex items-start md:items-center justify-start md:justify-center min-h-[600px] sm:min-h-[420px] md:min-h-[520px] lg:min-h-[620px] xl:min-h-[700px] pt-16 md:pt-0 px-4 sm:px-6">
        <div className="relative w-full max-w-[95%] sm:max-w-[520px] md:max-w-[620px]">
          <div
            className="
            w-[80px] h-[80px] md:w-[104px] md:h-[104px]
            bg-secondary/80
            text-white font-heading font-bold uppercase tracking-wide
            flex flex-col items-start justify-center pl-2 text-left leading-snug select-none
            mb-0 relative z-10
            md:absolute md:-left-[112px] md:top-0
          "
          >
            <span className="text-sm md:text-base">{t('badgeLine1')}</span>
            <span className="text-[10px] md:text-xs">{t('badgeLine2')}</span>
          </div>

          <div className="border border-white p-[6px] w-full">
            <div className="bg-primary/80 pl-4 pr-6 md:pr-16 py-3 md:py-2">
              <h1 className="font-heading font-black text-white text-[1.75rem] sm:text-3xl md:text-[2rem] lg:text-[2.25rem] leading-[1.1] mb-3 md:pr-6">
                {t('title')}
              </h1>

              <LinkButton
                href="/consulting/contacto"
                label={t('ctaLabel')}
                variant="secondary"
                className="!text-base hover:!bg-blue-400 transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
