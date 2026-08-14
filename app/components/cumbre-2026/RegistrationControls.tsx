'use client';

import { createContext, MouseEvent, ReactNode, useContext, useRef, useState } from 'react';
import type { Tariff } from './registration';

type RegistrationContextValue = {
  tariff: Tariff;
  setTariff: (tariff: Tariff) => void;
  withLodging: boolean;
  setWithLodging: (withLodging: boolean) => void;
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [tariff, setTariff] = useState<Tariff>('early');
  const [withLodging, setWithLodging] = useState(false);

  return (
    <RegistrationContext.Provider value={{ tariff, setTariff, withLodging, setWithLodging }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error('useRegistration debe usarse dentro de RegistrationProvider');
  }

  return context;
}

export function RegistrationCta({
  children,
  className,
  tariff,
  withLodging,
}: {
  children: ReactNode;
  className?: string;
  tariff?: Tariff;
  withLodging?: boolean;
}) {
  const registration = useRegistration();

  const handleClick = () => {
    if (tariff) registration.setTariff(tariff);
    if (withLodging !== undefined) registration.setWithLodging(withLodging);
  };

  return (
    <a className={className} href="#inscripcion" onClick={handleClick}>
      {children}
    </a>
  );
}

const mobileLinks = {
  es: [
    ['#cumbre', 'La Cumbre'],
    ['#experiencia', 'Experiencia'],
    ['#invitados', 'Invitados'],
    ['#agenda', 'Agenda'],
    ['#sigue', 'SIGUE'],
    ['#tarifas', 'Tarifas'],
    ['#faq', 'FAQ'],
    ['#inscripcion', 'Inscríbete'],
  ],
  en: [
    ['#cumbre', 'The Summit'],
    ['#experiencia', 'Experience'],
    ['#invitados', 'Guests'],
    ['#agenda', 'Schedule'],
    ['#sigue', 'SIGUE'],
    ['#tarifas', 'Rates'],
    ['#faq', 'FAQ'],
    ['#inscripcion', 'Register'],
  ],
} as const;

export function MobileNavigation({
  className,
  locale = 'es',
}: {
  className?: string;
  locale?: 'es' | 'en';
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = (event: MouseEvent<HTMLAnchorElement>) => {
    detailsRef.current?.removeAttribute('open');
    event.currentTarget.blur();
  };

  return (
    <details className={className} ref={detailsRef}>
      <summary aria-label={locale === 'en' ? 'Open menu' : 'Abrir menú'}>
        {locale === 'en' ? 'Menu' : 'Menú'}
      </summary>
      <nav aria-label={locale === 'en' ? 'Mobile Summit navigation' : 'Navegación móvil de la Cumbre'}>
        {mobileLinks[locale].map(([href, label]) => (
          <a key={href} href={href} onClick={closeMenu}>
            {label}
          </a>
        ))}
      </nav>
    </details>
  );
}
