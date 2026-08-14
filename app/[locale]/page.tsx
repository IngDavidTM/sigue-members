import HeroSection from '@/app/components/home/HeroSection';
import InfoSection from '@/app/components/home/InfoSection';
import JoinSection from '@/app/components/home/JoinSection';
import InvolvementSection from '@/app/components/home/InvolvementSection';
import ImpactRouteSection from '@/app/components/home/ImpactRouteSection';
import ConnectSection from '@/app/components/home/ConnectSection';
import TracksSection from '@/app/components/home/TracksSection';
import EventsSection from '@/app/components/home/EventsSection';
import ResourcesSection from '@/app/components/home/ResourcesSection';
import { redirect } from 'next/navigation';

const TEMPORARY_CUMBRE_REDIRECT = true;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  if (TEMPORARY_CUMBRE_REDIRECT) {
    const { locale } = await params;
    redirect(`/${locale === 'en' ? 'en' : 'es'}/cumbre-sigue-2026`);
  }

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <InfoSection />
      <JoinSection />
      <InvolvementSection />
      <ConnectSection />
      <TracksSection />
      <ImpactRouteSection />
      <EventsSection />
      <ResourcesSection />
    </main>
  );
}
