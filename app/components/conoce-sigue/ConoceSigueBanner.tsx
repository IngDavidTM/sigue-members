import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LinkButton from '@/app/components/ui/LinkButton';


const BANNER_IMAGE_URL =
  '/images/conoce_siguenetwork_banner.webp';

export default function ConoceSigueBanner() {
  const t = useTranslations('conoceSiguePage.banner');

  return (
    <section className="w-full overflow-hidden">
      {/* ── Mobile ─────────────────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Imagen completa  */}
        <div className="relative w-full h-80">
          <Image
            src={BANNER_IMAGE_URL}
            alt={t('imageAlt')}
            fill
            priority
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover object-bottom"
          />
        </div>

        {/* Caja de contenido debajo de la imagen */}
        <div className="bg-primary border-4 border-white px-6 py-7">
          {/* Badge "CONOCE SIGUE" */}
          <span className="inline-block bg-secondary text-white font-heading text-[13px] font-bold p-[7px_10px] mb-[18px] leading-none">
            <span className="block">{t('badgeLine1')}</span>
            <span className="block">{t('badgeLine2')}</span>
          </span>

          {/* Heading */}
          <h1 className="font-heading text-[22px] font-black text-white m-0 mb-[14px] leading-[1.2]">
            {t('heading')}
          </h1>

          {/* Body */}
          <p className="font-sans text-[15px] text-white m-0 mb-[22px] leading-[1.55]">
            {t('bodyStart')}
            <strong className="font-bold">{t('bodyBold1')}</strong>
            {t('bodyMid')}
            <strong className="font-bold">{t('bodyBold2')}</strong>
          </p>

          <LinkButton href="/sigue-tracks" label={t('ctaLabel')} subLabel={t('ctaSub')} />
        </div>
      </div>

      {/* ── Desktop ────────────────────────────────────────────── */}
      <div className="hidden lg:block relative overflow-hidden h-[430px]">
        {/* Imagen de fondo decorativa */}
        <Image
          src={BANNER_IMAGE_URL}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Contenedor exterior: contiene borde blanco */}
        <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-[60%] border-3 border-white p-1.5 bg-transparent">
          {/* BADGE AZUL */}
          <div className="absolute right-full mr-2.5 flex flex-col items-start justify-center text-left bg-secondary/80 text-white font-heading text-2xl font-black w-fit min-w-[85px] min-h-[85px] p-[10px_8px] leading-[1.1]">
            <span className="block">{t('badgeLine1')}</span>
            <span className="block">{t('badgeLine2')}</span>
          </div>
          {/* Caja de contenido superpuesta, centrada-izquierda */}
          <div className="relative bg-primary/80 px-9 py-[15px]">
            {/* Heading */}
            <h1 className="font-heading text-[29px] font-black text-white m-0 mb-[14px] leading-[1.2]">
              {t('heading')}
            </h1>

            {/* Body */}
            <p className="font-sans text-18 text-white m-0 mb-[22px] leading-[1.55]">
              {t('bodyStart')}
              <strong className="font-bold">{t('bodyBold1')}</strong>
              {t('bodyMid')}
              <strong className="font-bold">{t('bodyBold2')}</strong>
            </p>

            <LinkButton href="/sigue-tracks" label={t('ctaLabel')} subLabel={t('ctaSub')} />
          </div>
        </div>
      </div>
    </section>
  );
}
