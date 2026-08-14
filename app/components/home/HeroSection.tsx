'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const POSTER_URL = '/images/home-hero-poster.jpg';

const VIDEO_SRC =
  'https://www.youtube-nocookie.com/embed/vpfXjPA79G8?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&rel=0&playlist=vpfXjPA79G8';

export default function HeroSection() {
  const t = useTranslations('hero');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden h-[585px] lg:h-[800px]">
      <style>{`
        @media (min-width: 1427px) {
          .hero-iframe {
            width: 100vw !important;
            height: 56.25vw !important;
            min-height: 800px !important;
          }
        }
      `}</style>
      {/* Poster image — shown while iframe loads */}
      <div className="absolute inset-0">
        <Image
          src={POSTER_URL}
          alt=""
          fill
          priority
          style={{ objectFit: 'cover' }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile iframe — scale(3) zoom to cover any aspect ratio */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 lg:hidden ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <iframe
          src={VIDEO_SRC}
          title="SIGUE Network background video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 w-full h-full"
          style={{ border: 'none', transform: 'translate(-50%, -50%) scale(3)' }}
          onLoad={() => setVideoLoaded(true)}
        />
      </div>

      {/* Desktop iframe — exact dimensions for 803px section height */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 hidden lg:block ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <iframe
          src={VIDEO_SRC}
          title="SIGUE Network background video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full hero-iframe"
          style={{
            border: 'none',
            width: 'calc(800px * 16 / 9)',
            height: '800px',
          }}
          onLoad={() => setVideoLoaded(true)}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full">
        {/* Wrapper — always centered horizontally */}
        <div className="absolute top-[215px] left-1/2 -translate-x-1/2 lg:top-[178px]">
          {/* Decorative purple square */}
          <motion.div
            aria-hidden="true"
            className="absolute w-[62px] h-[62px] top-[-64px] left-[0px] z-[1] lg:w-[100px] lg:h-[100px] lg:top-[0px] lg:left-[-120px]"
            style={{ background: 'rgba(69, 16, 242, 0.6)' }}
            initial={reduceMotion ? false : { opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Main text box */}
          <motion.div
            className="relative border-2 border-white overflow-hidden flex flex-col justify-center w-[min(380px,calc(100vw-80px))] aspect-[2/1] px-[14px] py-[10px] lg:w-[805px] lg:h-[340px] lg:aspect-auto lg:px-[40px] lg:py-[24px]"
            style={{ background: 'rgba(239, 20, 82, 0.35)' }}
            initial={reduceMotion ? false : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              delay: reduceMotion ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h1
              className="text-white font-black text-[16px] leading-[1] mb-[5px] lg:text-[40px] lg:leading-[1] lg:mb-[9px]"
              style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif' }}
            >
              {t('title')}
            </h1>

            <p
              className="text-white italic font-normal text-[11px] mb-[4px] lg:text-[24px] lg:mb-[12px]"
              style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif' }}
            >
              {t('subtitle')}
            </p>

            <div>
              <Link
                href="/conoce-sigue"
                className="inline-block text-white font-normal text-[13px] no-underline px-[12px] py-[2px] lg:text-[26px] lg:px-[25px] lg:py-0"
                style={{
                  fontFamily: 'var(--font-heebo), Heebo, sans-serif',
                  background: '#4510F2',
                  borderRadius: 0,
                  lineHeight: '1.5',
                }}
              >
                {t('cta')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
