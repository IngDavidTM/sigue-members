import ConoceSigueBanner from '@/app/components/conoce-sigue/ConoceSigueBanner';
import ConoceDesafioSection from '@/app/components/conoce-sigue/ConoceDesafioSection';
import ConoceRespuestaSection from '@/app/components/conoce-sigue/ConoceRespuestaSection';
import ConoceMotivationSection from '@/app/components/conoce-sigue/ConoceMotivationSection';
import ConoceTeoriaDelCambioSection from '@/app/components/conoce-sigue/ConoceTeoriaDelCambioSection';
import ConoceInteractiveSigue from '@/app/components/conoce-sigue/ConoceInteractiveSigue';

export default function ConoceSiguePage() {
  return (
    <main>
      <ConoceSigueBanner />
      <ConoceDesafioSection />
      <ConoceRespuestaSection />
      <ConoceMotivationSection />
      <ConoceTeoriaDelCambioSection />
      <ConoceInteractiveSigue />
    </main>
  );
}
