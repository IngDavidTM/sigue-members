import { useTranslations } from 'next-intl';
import LinkButton from '@/app/components/ui/LinkButton';

export default function QueSonSigueTracks() {
  const t = useTranslations('sigueTracksPage.intro');
  {
    /* Seccion Que son los Sigue Tracks  TODO: Responsive Design */
  }
  return (
    <section className="flex flex-wrap w-full overflow-hidden h-fit mt-8 mb-5">
      {/* Parte Izquierda - Fondo morado y texto */}
      <div className="w-17/30 h-auto bg-secondary p-5">
        <div className="font-sans text-3xl text-white text-right p-5">
          <p className="font-heading text-4xl font-bold">{t('introLine1')}</p>
          <p> {t('introLine2')}</p>
          <p>
            <span className="font-bold">{t('introLine3_bold')} </span>
            {t('introLine3_regular')}
          </p>
          <p> {t('introLine4')}</p>
        </div>
      </div>
      {/* Parte Derecha - Fondo lavanda y botón */}
      <div className="flex w-13/30 h-auto bg-accent-lavender items-center justify-center">
        <LinkButton
          label={t('buttonLabel')}
          subLabel={t('buttonSubLabel')}
          href="#" /*TODO: ASIGNAR LINK CUANDO ESTE DISPONIBLE*/
          variant="primary"
          className="max-w-50 text-center"
        />
      </div>
    </section>
  );
}
