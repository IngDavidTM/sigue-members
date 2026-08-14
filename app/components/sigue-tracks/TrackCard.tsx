import LinkButton from '@/app/components/ui/LinkButton';
import Image from 'next/image';

export interface TrackCardProps {
  imageSrc: string;
  imageAlt: string;
  cardTitle: string;
  cardSubtitle: string;
  cardBody: string;
  btnLabel: string;
  btnSubLabel: string;
}

export default function TrackCard({
  imageSrc,
  imageAlt,
  cardTitle,
  cardSubtitle,
  cardBody,
  btnLabel,
  btnSubLabel,
}: TrackCardProps) {
  return (
    <div className="max-w-90 h-160 bg-accent-light-purple text-secondary-deep text-center pb-20">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={400}
        height={400}
        style={{ objectFit: 'cover', maxHeight: 300, maxWidth: '100%' }}
        className="overflow-hidden"
      />
      <p className="text-4xl font-bold py-5">{cardTitle}</p>
      <p className="text-2xl font-bold">{cardSubtitle}</p>
      <p className="text-xl px-2 h-10">{cardBody}</p>
      <LinkButton
        label={btnLabel}
        subLabel={btnSubLabel}
        href="" //TODO: AGREGAR EL LINK CUANDO ESTE DISPONIBLE
        variant="primary"
        className="max-w-40 relative -bottom-45"
      />
    </div>
  );
}
