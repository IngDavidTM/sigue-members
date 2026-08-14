import Image from 'next/image';
import { useTranslations } from 'next-intl';

const IMAGE_BANNER_URL = '/images/sigue_tracks_banner.jpg';

export default function SigueTracksBanner() {
  const t = useTranslations('sigueTracksPage.banner');

  return (
    <section className="w-full overflow-hidden">
      {/* Imagen completa */}
      <div className="relative w-full h-180">
        <Image
          src={IMAGE_BANNER_URL}
          alt={t('imageAlt')}
          fill
          priority
          className="object-cover object-center"
        />
        {/* Cuadro de contenido: TODO revisar responsive design */}
        <div className="absolute size-100 bg-secondary-dark/40 xl:top-20 xl:right-138 lg:top-15 lg:right-80 md:top-10 md:right-50">
          {/* Cuadros decorativos*/}
          <div className="absolute w-60 h-30 bg-background/50 top-10 right-10"></div>
          <div className="absolute size-30 bg-primary/50 top-10 -right-40"></div>
          {/* Contenedor de texto */}
          <div className="absolute inset-x-0 bottom-0 h-55 px-5">
            <h1 className="font-heading text-[42px] text-white ">
              <span className="font-black"> {t('badgeLine1')} </span>
              {t('badgeLine2')}
            </h1>
            <p className="font-sans text-white text-4xl">
              {t('badgeLine3')} <br /> {t('badgeLine4')} <br /> {t('badgeLine5')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
