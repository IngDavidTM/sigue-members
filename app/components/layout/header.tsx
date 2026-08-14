'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

const SocialIcons = ({ size = 13 }: { size?: number }) => (
  <div className="flex items-center gap-2.5">
    <a
      href="https://www.instagram.com/siguenetwork/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="text-primary hover:text-secondary transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    </a>
    <a
      href="https://www.facebook.com/people/SIGUE-Network/61566310019607/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      className="text-primary hover:text-secondary transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </a>
    <a
      href="https://www.linkedin.com/company/sigue-network/posts/?feedView=all"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="text-primary hover:text-secondary transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </a>
  </div>
);

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('header.aria');

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        aria-label={t('english')}
        onClick={() => switchLocale('en')}
        className={`transition-opacity ${locale === 'en' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
      >
        <img
          src="https://flagcdn.com/w40/us.png"
          alt={t('english')}
          width={26}
          height={18}
          style={{ borderRadius: 0 }}
        />
      </button>
      <button
        aria-label={t('espanol')}
        onClick={() => switchLocale('es')}
        className={`transition-opacity ${locale === 'es' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
      >
        <img
          src="https://flagcdn.com/w40/es.png"
          alt={t('espanol')}
          width={26}
          height={18}
          style={{ borderRadius: 0 }}
        />
      </button>
    </div>
  );
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const t = useTranslations('header');
  const locale = useLocale();

  const navLinks = [
    { labelKey: 'nav.inicio', href: `/${locale}/` },
    { labelKey: 'nav.conoceSigue', href: `/${locale}/conoce-sigue` },
    { labelKey: 'nav.sigueTracks', href: `/${locale}/sigue-tracks` },
    { labelKey: 'nav.sigueConsulting', href: `/${locale}/sigue-consulting` },
    { labelKey: 'nav.sigueHub', href: `/${locale}/sigue-hub` },
    { labelKey: 'nav.unete', href: `/${locale}/unete` },
    { labelKey: 'nav.contactanos', href: `/${locale}/contacto` },
  ];

  return (
    <>
      {/* Top bar desktop */}
      <div
        data-site-header
        className="hidden lg:block w-full bg-background border-b border-accent-soft-purple/40"
      >
        <div className="w-full px-4 lg:px-6 py-2.5 flex items-center gap-4">
          <div className="flex items-center gap-3 max-w-7xl mx-auto flex-1">
            <a
              href="mailto:contacto@siguenetwork.org"
              className="text-xs text-black hover:text-primary transition-colors whitespace-nowrap"
            >
              contacto@siguenetwork.org
            </a>
            <span className="text-accent-lavender/60 select-none text-xs">|</span>
            <SocialIcons size={13} />
            <span className="flex-1" />
            <a
              href={`/${locale}/unete`}
              className="text-xs text-black hover:text-primary transition-colors whitespace-nowrap"
            >
              {t('topBar.unete')}
            </a>
            <span className="text-accent-lavender select-none text-xs">|</span>
            <a
              href={`/${locale}/conoce-sigue`}
              className="text-xs text-black hover:text-primary transition-colors whitespace-nowrap"
            >
              {t('topBar.conoceSigue')}
            </a>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Nav desktop */}
      <nav
        data-site-header
        className="hidden lg:block w-full bg-background-soft shadow-sm sticky top-0 z-50"
        style={{ height: '100px' }}
      >
        <div
          className="w-full lg:max-w-[1164px] lg:mx-auto px-4 lg:px-8 h-full flex items-stretch relative"
          style={{ overflow: 'visible' }}
        >
          <div style={{ width: '210px', flexShrink: 0 }} />
          <Link
            href={`/${locale}`}
            style={{ position: 'absolute', left: '1rem', top: '0.8rem', zIndex: 10 }}
          >
            <Image
              src="/images/logo_siguenetwork.jpg"
              alt="SIGUE Network"
              width={140}
              height={140}
              className="w-[130px] h-[130px] lg:w-[143px] lg:h-[143px] object-contain"
              priority
            />
          </Link>
          <div className="flex items-stretch flex-1 justify-end">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-2 lg:px-2 xl:px-3 2xl:px-3.5 text-[12px] lg:text-[12px] xl:text-[15px] 2xl:text-[17px] font-heading font-bold tracking-wide transition-colors whitespace-nowrap text-black hover:text-primary"
              >
                {t(link.labelKey as Parameters<typeof t>[0])}
              </Link>
            ))}
            <Link
              href={`/${locale}/donacion`}
              className="flex items-center ml-1 px-2 lg:px-2 xl:px-3 2xl:px-4 bg-primary text-white font-heading font-bold text-[12px] lg:text-[12px] xl:text-[15px] 2xl:text-[17px] tracking-wide hover:bg-primary/90 transition-colors whitespace-nowrap"
              style={{ alignSelf: 'stretch' }}
            >
              {t('nav.donacion')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile header */}
      <div
        data-site-header
        className="lg:hidden bg-background-soft shadow-sm sticky top-0 z-50 px-10 flex items-center relative"
        style={{ minHeight: '100px', paddingTop: '10px', paddingBottom: '10px' }}
      >
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={t('aria.toggleMenu')}
          aria-expanded={menuOpen}
          className="text-primary z-10 flex items-center justify-center"
          style={{ width: '40px', height: '40px' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <Link
          href={`/${locale}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Image
            src="/images/logo_siguenetwork.jpg"
            alt="SIGUE Network"
            width={82}
            height={82}
            className="w-[75px] h-[75px] object-contain"
            priority
          />
        </Link>
        <div className="absolute right-4 top-3">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        data-site-header
        className="lg:hidden bg-background border-t border-accent-soft-purple sticky top-[100px] z-40 overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? '600px' : 0, opacity: menuOpen ? 1 : 0 }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-3.5 text-sm font-sans font-medium text-black hover:text-primary hover:bg-background-soft transition-colors border-b border-accent-soft-purple/60"
          >
            {t(link.labelKey as Parameters<typeof t>[0])}
          </Link>
        ))}
        <Link
          href={`/${locale}/donacion`}
          onClick={() => setMenuOpen(false)}
          className="block px-6 py-3.5 text-sm font-heading font-bold text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          {t('nav.donacion')}
        </Link>
      </div>
    </>
  );
}
