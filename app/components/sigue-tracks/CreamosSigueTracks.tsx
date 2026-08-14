import { useTranslations } from 'next-intl';

export default function CreamosSigueTracks() {
  const t = useTranslations('sigueTracksPage.creamos');
  return (
    <section className="flex flex-wrap w-full overflow-hidden h-fit mb-5">
      {/*Parte Izquierda - Bloques geométricos (Rojo/Blanco)   TODO: Responsive Design */}
      <div className="flex w-17/30 h-auto bg-secondary-deep items-center">
        {/* Bloque Rojo */}
        <div className="w-140 h-46 bg-primary mr-20"></div>
        {/* Bloque Blanco */}
        <div className="size-46 bg-white"></div>
      </div>
      {/* Parte Derecha - Texto Explicativo */}
      <div className="w-13/30 h-auto bg-secondary p-10">
        <div className="font-sanz text-3xl text-white ">
          <p>
            {t('line1')} <span className="font-bold">{t('line1_bold')}</span>
          </p>
          <p>
            <span className="font-bold">{t('line2_bold')} </span>
            {t('line2')}
          </p>
          <p>{t('line3')}</p>
          <p>{t('line4')}</p>
          <p>{t('line5')}</p>
          <p>{t('line6')}</p>
          <p>{t('line7')}</p>
        </div>
      </div>
    </section>
  );
}
