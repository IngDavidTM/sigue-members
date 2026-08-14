import Image from 'next/image';
import { useTranslations } from 'next-intl';

// TODO: reemplazar con imagen real del equipo SIGUE
const TEAM_IMAGE_URL =
  '/images/conoce_sigue_desafios.webp';

const BARRIER_KEYS = ['funding', 'impact', 'sustainability', 'visibility'] as const;

export default function ConoceDesafioSection() {
  const t = useTranslations('conoceSiguePage.desafio');

  return (
    <section className="w-full">
      {/* ── Mobile ─────────────────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Imagen */}
        <div className="relative w-full h-64 border-l-6 border-primary">
          <Image
            src={TEAM_IMAGE_URL}
            alt={t('imageAlt')}
            fill
            sizes="(max-width: 1023px) calc(100vw - 6px)"
            className="object-cover object-[center_10%]"
          />
        </div>

        {/* Título */}
        <div className="bg-secondary-deep px-6 py-7">
          <h2 className="font-heading text-[32px] font-black text-white m-0 leading-[1.2] text-right">
            <span className="block">
              {t('titleLine1Start')}
              <strong className="font-black">{t('titleLine1Bold')}</strong>
            </span>
            <span className="block">{t('titleLine2')}</span>
            <span className="block">
              <strong className="font-black">{t('titleLine3Bold')}</strong>
              {t('titleLine3End')}
            </span>
          </h2>
        </div>

        {/* Descripción */}
        <div className="bg-background-soft px-6 py-7">
          <p className="font-sans text-[15px] text-secondary-deep text-justify m-0 leading-[1.6]">
            {t('descStart')}
            <strong className="font-bold">{t('descBold')}</strong>
          </p>
        </div>

        {/* Intro barreras */}
        <div className="bg-accent-light-purple px-6 py-4">
          <p className="font-sans text-[15px] text-secondary text-center m-0 leading-[1.6]">
            <span className="block">
              {t('introStart')}
              <strong className="font-extrabold">{t('introBold1')}</strong>
              {t('introMid')}
            </span>
            <span className="block">{t('introMid2')}</span>
            <span className="block">
              {t('introMid3')}
              <strong className="font-extrabold">{t('introBold2')}</strong>
              {t('introEnd')}
            </span>
          </p>
        </div>

        {/* Barreras — columna única */}
        <div className="bg-background-soft px-4 pb-6">
          {BARRIER_KEYS.map((key) => (
            <div
              key={key}
              className="bg-accent-medium-purple px-4.5 py-4 mb-3 flex gap-3 items-start"
            >
              {/* Bullet cuadrado */}
              <div
                aria-hidden="true"
                className="w-4 h-4 bg-accent-lavender shrink-0 mt-1"
              />
              <p className="font-sans text-sm text-secondary-deep m-0 leading-normal">
                <strong className="font-bold">{t(`barriers.${key}.title`)}</strong>
                {' – '}
                <strong className="font-semibold text-white">{t(`barriers.${key}.body`)}</strong>
              </p>
            </div>
          ))}
        </div>

        {/* Resultado */}
        <div className="flex w-full mb-3">
          <div className="w-3 bg-secondary shrink-0" aria-hidden="true" />
          <div className="flex-1 bg-accent-medium-purple px-6 py-4.5">
            <p className="font-sans text-sm text-secondary-deep m-0 leading-[1.6]">
              <strong className="font-bold">{t('resultLabel')}</strong>
              {t('resultText')}
              <strong className="font-bold">{t('resultBold')}</strong>
              {t('resultEnd')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Desktop ────────────────────────────────────────────── */}
      <div className="hidden lg:block">
        {/* Fila 1: espacio izquierdo (alineado con imagen) + título morado + logo */}
        <div className="flex items-stretch min-h-50 w-full">
          <div className="flex-[0_1_35%] bg-accent-medium-purple flex justify-end">
            <div className="w-25 h-10 my-5 mx-3.75 bg-white" aria-hidden="true" />
          </div>

          {/* Columna: Título morado */}
          <div className="flex-1 bg-secondary-deep flex flex-col">
            {/* columna1 */}
            <div className="self-start">
              <div className="w-12.5 h-10 my-5 mx-3.75 bg-secondary" aria-hidden="true" />
            </div>
            {/* columna2 */}
            <div className="self-end px-7.5 pb-5">
              <h2 className="font-heading text-4xl font-normal text-white m-0 leading-[1.2] text-right">
                <span className="block">
                  {t('titleLine1Start')}
                  <strong className="font-black">{t('titleLine1Bold')}</strong>
                </span>
                <span className="block">{t('titleLine2')}</span>
                <span className="block">
                  <strong className="font-black">{t('titleLine3Bold')}</strong>
                  {t('titleLine3End')}
                </span>
              </h2>
            </div>
          </div>

          {/* Columna : Logo SIGUE */}
          <div className="flex-[0_0_20%] bg-white/60 flex items-end justify-center relative min-h-30">
            <div className="relative w-4/5 h-4/5">
              <Image
                src="/images/logo_siguenetwork.jpg"
                alt="SIGUE Network"
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Fila 2: imagen con decorativos + párrafo intro + espacio derecho */}
        <div className="flex items-stretch min-h-100 w-full p-2.5 bg-accent-soft-purple">
          {/* Imagen */}
          <div className="flex-[0_1_35%] bg-primary">
            <div className="flex flex-col w-full">
              {/* Contenedor de caja*/}
              <div className="w-17.5 h-17.5 mt-5 ml-5 bg-secondary-deep shrink-0" aria-hidden="true" />
              {/* Contenedor de la imagen inferior */}
              <div className="self-end w-[95%] min-h-75 relative my-5 border border-white">
                <Image
                  src={TEAM_IMAGE_URL}
                  alt={t('imageAlt')}
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="object-cover object-top"
                />
                <div aria-hidden="true" className="absolute w-[15%] h-1/2 m-2.5 bg-white/50" />
              </div>
            </div>
          </div>

          {/* Párrafo intro — fondo lavanda */}
          <div className="flex-1 bg-background-soft flex items-center px-2.5 py-7">
            <p className="font-sans text-2xl font-light text-secondary-deep text-justify m-0 leading-[1.65]">
              {t('descStart')}
              <strong className="font-bold">{t('descBold')}</strong>
            </p>
          </div>

          {/* Columna blanca derecha — alineada con el logo de arriba */}
          <div className="flex-[0_0_20%] bg-accent-soft-purple flex justify-center items-start">
            <div className="w-27.5 h-75 bg-white" />
          </div>
        </div>

        {/* Intro barreras */}
        <div className="flex flex-row items-stretch w-full bg-background-soft">
          <div className="flex-[0_0_65%] bg-accent-light-purple py-2.5">
            <p className="font-sans text-2xl text-secondary text-right mx-auto max-w-205 leading-[1.6]">
              <span className="block">
                {t('introStart')}
                <strong className="font-extrabold">{t('introBold1')}</strong>
                {t('introMid')}
              </span>
              <span className="block">{t('introMid2')}</span>
              <span className="block">
                {t('introMid3')}
                <strong className="font-extrabold">{t('introBold2')}</strong>
                {t('introEnd')}
              </span>
            </p>
          </div>
          <div className="w-full bg-secondary" />
        </div>

        {/* Grid de barreras — 2 columnas */}
        <div className="bg-blue-100 pt-4 pb-8 grid grid-cols-[60%_1fr] gap-x-10 pl-40 pr-40">
          <div className="bg-accent-medium-purple flex flex-col">
            {BARRIER_KEYS.filter(key => key !== 'visibility').map((key) => (
              <div
                key={key}
                className="px-5.5 pt-3 py-2 flex flex-row gap-3.5 items-start border-b border-white/10 last:border-0"
              >
                {/* Bullet cuadrado morado fuerte */}
                <div className="w-10 h-10 bg-accent-lavender shrink-0 mt-1" />

                <p className="font-sans text-[22px] text-secondary-deep m-0 leading-7">
                  <strong className="font-bold">{t(`barriers.${key}.title`)}</strong>
                  {' – '}
                  <strong className='font-semibold text-white'>
                    {t(`barriers.${key}.body`)}
                  </strong>
                </p>
              </div>
            ))}
          </div>
          <div className="bg-background-neutral px-5.5 py-6 flex items-start gap-3.5 h-full w-full">
            {/* Bullet cuadrado lila suave */}
            <div className="w-10 h-10 bg-accent-lavender shrink-0" />

            <p className="font-sans text-[24px] text-secondary m-0 leading-[1.55]">
              <strong className="font-bold">{t(`barriers.visibility.title`)}</strong>
              {' – '}
              {t(`barriers.visibility.body`)}
            </p>
          </div>
        </div>

        {/* Resultado */}
        <div className="grid grid-cols-[25%_1fr] w-full bg-secondary-deep mb-5  ">
          <div className='bg-secondary '/>
          <div className='pt-2 px-11 bg-accent-medium-purple'>
            <p className="font-sans text-[25px] text-secondary-deep mx-auto pb-1.5 max-w-275 leading-[1.10] text-start">
              <strong className="font-bold">{t('resultLabel')}</strong>
              {t('resultText')}
              <strong className="font-bold">{t('resultBold')}</strong>
              {t('resultEnd')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
