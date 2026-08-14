import Image from 'next/image';
import { useTranslations } from 'next-intl';

// TODO: reemplazar con imagen real de presentación SIGUE
const PRESENTATION_IMAGE_URL = '/images/conoce_sigue_facilitador.webp';

const BENEFIT_KEYS = ['strengthen', 'impulse', 'accompany'] as const;

export default function ConoceRespuestaSection() {
  const t = useTranslations('conoceSiguePage.respuesta');

  return (
    <section className="w-full">
      {/* ── Mobile ─────────────────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Franja decorativa */}
        <div className="w-full h-4 bg-primary" aria-hidden="true" />
        {/* Título */}
        <div className="bg-secondary-deep px-6 py-6">
          <h2 className="font-heading text-3xl font-normal text-white m-0 leading-[1.2]">
            <span className="block">{t('titleLine1')}</span>
            <span className="block">
              <strong className="font-black text-primary">{t('titleConectar')}</strong>
              <span className="font-black text-white">{t('titlePlus')}</span>
              <strong className="font-black text-accent-medium-purple">{t('titlePotenciar')}</strong>
            </span>
          </h2>
        </div>
        {/* Franja decorativa */}
        <div className="w-full h-4 bg-secondary-dark" aria-hidden="true" />
        <div className="w-full h-4 bg-accent-medium-purple" aria-hidden="true" />

        {/* Imagen */}
        <div className='p-2 bg-secondary-deep'>
            <div className="relative w-full h-80 ">
                <Image
                    src={PRESENTATION_IMAGE_URL}
                    alt={t('imageAlt')}
                    fill
                    sizes="(max-width: 1023px) 100vw"
                    className="object-cover object-[center_20%]"
                />
                <div aria-hidden="true" className="absolute w-[13%] h-12 m-2.5 mt-5 bg-secondary/70" />
                <div aria-hidden="true" className="absolute w-[13%] h-1/2 m-2.5 mt-20 bg-white/70" />
            </div>
        </div>

        {/* Contenido */}
        <div className="bg-secondary px-6 py-7">
          <p className="font-sans text-[20px] text-white m-0 leading-[1.6] mb-5">
            {t('bodyIntro')}
          </p>

          <ul className="m-0 p-0 list-none flex flex-col gap-3 mb-5">
            {BENEFIT_KEYS.map((key) => (
              <li key={key} className="flex gap-2 items-start">
                <span aria-hidden="true" className="text-secondary-deep font-bold text-[24px] shrink-0">✓</span>
                <p className="font-sans text-[20px] text-white m-0 leading-[1.5]">
                  <strong className="font-bold">{t(`benefits.${key}.bold`)}</strong>
                  {t(`benefits.${key}.rest`)}
                </p>
              </li>
            ))}
          </ul>

          <p className="font-sans text-[20px] text-white m-0 leading-[1.6]">
            {t('closingStart')}
            <strong className="font-bold">{t('closingBold1')}</strong>
            {t('closingMid')}
            <strong className="font-bold">{t('closingBold2')}</strong>
            {t('closingEnd')}
          </p>
        </div>
        <div className="w-full h-4 bg-accent-medium-purple mb-4" aria-hidden="true" />

      </div>

      {/* ── Desktop ────────────────────────────────────────────── */}
      <div className="hidden lg:block">
        {/* Fila título */}
        <div className="flex items-stretch w-full min-h-20">
          {/* Franja roja izquierda */}
          <div className="flex-[0_0_45%] bg-primary" aria-hidden="true" />

          {/* Título */}
          <div className="flex-1 bg-secondary-deep flex items-center px-3 py-2">
            <h2 className="font-heading text-4xl font-normal text-white m-0 leading-[1.25]">
              <span className="block">{t('titleLine1')}</span>
              <span className="block">
                <strong className="font-black text-primary">{t('titleConectar')}</strong>
                <span className="font-black text-white">{t('titlePlus')}</span>
                <strong className="font-black text-accent-medium-purple">{t('titlePotenciar')}</strong>
              </span>
            </h2>
          </div>

          {/* Cuadro decorativo derecho */}
          <div className="flex-[0_0_5%] bg-secondary" aria-hidden="true" />
        </div>

        {/* Franja decorativa */}
        <div className="w-full h-4 bg-accent-medium-purple" aria-hidden="true" />

        {/* Fila principal: imagen + text */}
        <div className="flex items-stretch w-full">
          {/* Columna imagen */}
          <div className="flex-[0_0_50%] bg-secondary-deep flex flex-col min-h-96">

            {/* imagen */}
            <div className="flex flex-1">
              <div className="relative flex-1 min-h-[500px] ">
                {/* Contenedor de caja*/}
                <div className="z-10 absolute w-[12%] h-22 mt-15 ml-3 bg-secondary/80 shrink-0" aria-hidden="true" />
                <div className="relative w-[95%] min-h-full">
                    <Image
                    src={PRESENTATION_IMAGE_URL}
                    alt={t('imageAlt')}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover object-top pt-10 pr-10 pb-10  "
                    />
                    <div aria-hidden="true" className="absolute w-[13%] h-1/2 m-2.5 mt-40 bg-white/70" />
                </div>
              </div>
            </div>

          </div>

          {/* Columna texto */}
          <div className="flex-1 bg-secondary flex flex-col justify-center px-12 py-10">
            <p className="font-sans text-[22px] text-white m-0 leading-[1.65] mb-6">
              {t('bodyIntro')}
            </p>

            <ul className="m-0 p-0 list-none flex flex-col gap-3 mb-6">
              {BENEFIT_KEYS.map((key) => (
                <li key={key} className="flex gap-2 items-start">
                  <span aria-hidden="true" className="text-secondary-deep font-bold text-[30px] shrink-0">✓</span>
                  <p className="font-sans text-[22px] text-white m-0 leading-[1]">
                    <strong className="font-bold">{t(`benefits.${key}.bold`)}</strong>
                    {t(`benefits.${key}.rest`)}
                  </p>
                </li>
              ))}
            </ul>

            <p className="font-sans text-[22px] text-white m-0 leading-[1.65]">
              {t('closingStart')}
              <strong className="font-bold">{t('closingBold1')}</strong>
              {t('closingMid')}
              <strong className="font-bold">{t('closingBold2')}</strong>
              {t('closingEnd')}
            </p>
          </div>
        </div>
        {/* Franja decorativa */}
        <div className="w-full h-4 bg-accent-medium-purple" aria-hidden="true" />

      </div>
    </section>
  );
}
