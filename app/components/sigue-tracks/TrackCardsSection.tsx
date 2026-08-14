import { useTranslations } from 'next-intl';
import TrackCard from '@/app/components/sigue-tracks/TrackCard';

export default function TrackCardsSection() {
  //TODO: RESPONSIVE DESIGN
  const t = useTranslations('sigueTracksPage.trackCards');

  const imgUrls = [
    '/images/sigueTracksCard1.png',
    '/images/sigueTracksCard2.png',
    '/images/sigueTracksCard3.png',
  ];

  const items = imgUrls.map((img, index) => ({
    cardTitle: t(`items.${index}.cardTitle`),
    cardSubtitle: t(`items.${index}.cardSubTitle`),
    cardBody: t(`items.${index}.cardBody`),
    btnLabel: t(`items.${index}.btnLabel`),
    btnSubLabel: t(`items.${index}.btnSubLabel`),
    imageAlt: t(`items.${index}.imageAlt`),
    img,
  }));

  return (
    <section className="w-full h-fit p-20 flex flex-wrap items-center justify-center gap-10 mb-10">
      {items.map((item, index) => {
        return (
          <TrackCard
            imageAlt={item.imageAlt}
            imageSrc={item.img}
            cardTitle={item.cardTitle}
            cardSubtitle={item.cardSubtitle}
            cardBody={item.cardBody}
            btnLabel={item.btnLabel}
            btnSubLabel={item.btnSubLabel}
            key={index}
          />
        );
      })}
    </section>
  );
}
