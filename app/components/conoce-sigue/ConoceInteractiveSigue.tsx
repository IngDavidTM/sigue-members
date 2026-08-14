'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

const COLORS = ['#5B188F', '#7210F2', '#EC4671', '#B419A1', '#EF1452'];

export default function ConoceInteractiveSigue() {
  const t = useTranslations('conoceSiguePage.sigue');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const items = COLORS.map((color, index) => ({
    letter: t(`items.${index}.letter`),
    label: t(`items.${index}.label`),
    description: t(`items.${index}.description`),
    verse: t(`items.${index}.verse`),
    color,
  }));

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(null);
  };

  return (
    <section className="w-full bg-white py-12 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 mb-10 max-w-6xl mx-auto">
        <div
          className="text-white font-heading font-black uppercase text-center leading-tight flex items-center justify-center shrink-0 w-full sm:w-auto"
          style={{ backgroundColor: '#4510F2' }}
        >
          <span
            className="sm:hidden flex items-center justify-center w-full"
            style={{ fontSize: '1.75rem', whiteSpace: 'nowrap', height: '220px' }}
          >
            {t('sectionTitle')}
          </span>
          <span
            className="hidden sm:flex flex-col items-center justify-center text-center"
            style={{ width: '210px', height: '210px', fontSize: '2.25rem' }}
          >
            {t('sectionTitle')}
          </span>
        </div>

        <p className="text-gray-700 font-sans" style={{ fontSize: '1.35rem' }}>
          {t('subtitle')} <strong>{t('subtitleBold')}</strong>.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col lg:flex-row gap-3 max-w-6xl mx-auto">
        {items.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={item.letter}
              className="relative rounded-sm cursor-pointer overflow-hidden text-white select-none lg:flex-1"
              style={{
                backgroundColor: item.color,
                height: 'clamp(300px, 30vw, 340px)',
              }}
              onClick={() => handleToggle(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <AnimatePresence mode="wait">
                {!isActive ? (
                  <motion.div
                    key="front"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute top-3 right-3 text-white/80 text-base font-normal leading-none">
                      →
                    </div>
                    <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center gap-4 px-4 pt-4">
                      <span
                        className="font-heading text-white"
                        style={{ fontSize: '8rem', lineHeight: 1, fontWeight: 900 }}
                      >
                        {item.letter}
                      </span>
                      <p
                        className="font-heading font-bold text-center leading-tight w-full"
                        style={{ fontSize: '1.2rem' }}
                      >
                        {item.label}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    className="absolute inset-0 flex flex-col p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p
                      className="text-white leading-snug text-center flex-1 flex items-center justify-center px-1 font-sans font-bold"
                      style={{ fontSize: '1rem' }}
                    >
                      {item.description}
                    </p>
                    <p
                      className="font-sans text-white/80 text-center leading-snug mb-3"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {item.verse}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={handleClose}
                        aria-label={t('closeAriaLabel')}
                        className="border-2 border-white/80 rounded-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        style={{
                          width: '1.9rem',
                          height: '1.9rem',
                          fontSize: '1rem',
                          fontWeight: 900,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
