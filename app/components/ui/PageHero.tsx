'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Reveal from '@/app/components/ui/Reveal';

interface PageHeroProps {
  imageSrc: string;
  imageAlt: string;
  badge: string;
  title: ReactNode;
  subtitle?: string;
  strongOverlay?: boolean;
  titleClassName?: string;
  imageOverlayClassName?: string;
}

export default function PageHero({
  imageSrc,
  imageAlt,
  badge,
  title,
  subtitle,
  strongOverlay = false,
  titleClassName = '',
  imageOverlayClassName = 'bg-white/60',
}: PageHeroProps) {
  return (
    <section className="relative h-[585px] w-full overflow-hidden lg:h-[800px]">
      <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      <div className={`absolute inset-0 ${imageOverlayClassName}`} aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center px-10">
        <Reveal variant="slide-left" className="relative w-full max-w-[600px]">
          <div
            className={`flex min-h-[155px] flex-col justify-center border-2 border-white px-4 py-5 text-white sm:min-h-[190px] sm:px-12 ${
              strongOverlay ? 'bg-primary/80' : 'bg-primary/35'
            }`}
          >
            <h1
              className={`font-heading text-2xl font-black leading-[1.02] sm:text-3xl lg:text-[40px] ${titleClassName}`}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 font-sans text-base leading-snug sm:text-xl lg:text-2xl">
                {subtitle}
              </p>
            )}
          </div>

          <div
            className="absolute bottom-full left-0 mb-1 flex h-[76px] w-[76px] items-center justify-center bg-secondary/80 text-center font-heading text-sm font-black tracking-wide text-white sm:bottom-auto sm:right-full sm:left-auto sm:top-0 sm:mr-1 sm:h-[100px] sm:w-[100px] sm:text-base"
            aria-hidden="true"
          >
            {badge}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
