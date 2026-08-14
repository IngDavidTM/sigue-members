import SigueTracksBanner from '@/app/components/sigue-tracks/SigueTracksBanner';
import QueSonSigueTracks from '@/app/components/sigue-tracks/QueSonSigueTracks';
import CreamosSigueTracks from '@/app/components/sigue-tracks/CreamosSigueTracks';
import TrackCardsSection from '@/app/components/sigue-tracks/TrackCardsSection';

export default function SigueTracksPage() {
  return (
    <main>
      <SigueTracksBanner />
      <QueSonSigueTracks />
      <CreamosSigueTracks />
      <TrackCardsSection />
    </main>
  );
}
