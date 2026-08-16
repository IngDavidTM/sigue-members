'use client';

import { useEffect, useMemo, useState } from 'react';
import { tariffs } from './registration';
import styles from './CumbreLanding.module.css';

const FALLBACK_COP_PER_USD = 3000;

type ExchangeRateResponse = {
  copPerUsd?: number;
  updatedAt?: string;
  fallback?: boolean;
};

export default function UsdEquivalents({ locale }: { locale: 'es' | 'en' }) {
  const [rate, setRate] = useState(FALLBACK_COP_PER_USD);
  const [updatedAt, setUpdatedAt] = useState<string>();
  const [usingFallback, setUsingFallback] = useState(true);
  const english = locale === 'en';
  const text = (spanish: string, englishText: string) => (english ? englishText : spanish);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/exchange-rate', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Rate unavailable'))))
      .then((data: ExchangeRateResponse) => {
        if (!Number.isFinite(data.copPerUsd) || !data.copPerUsd || data.copPerUsd <= 0) return;
        setRate(data.copPerUsd);
        setUpdatedAt(data.updatedAt);
        setUsingFallback(Boolean(data.fallback));
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const usd = useMemo(
    () =>
      new Intl.NumberFormat(english ? 'en-US' : 'es-CO', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
    [english]
  );
  const cop = useMemo(
    () => new Intl.NumberFormat(english ? 'en-US' : 'es-CO', { maximumFractionDigits: 0 }),
    [english]
  );
  const equivalent = (amount: number) => usd.format(amount / rate);
  const asOf = updatedAt
    ? new Intl.DateTimeFormat(english ? 'en-US' : 'es-CO', {
        dateStyle: 'medium',
        timeZone: 'UTC',
      }).format(new Date(updatedAt))
    : null;

  return (
    <p className={styles.exchangeNote} aria-live="polite">
      {text('Equivalentes aproximados en USD', 'Approximate USD equivalents')} —
      {' '}{text('General', 'General')}: {equivalent(tariffs.general.pass)} / {equivalent(tariffs.general.lodging)} ·
      {' '}Early Bird: {equivalent(tariffs.early.pass)} / {equivalent(tariffs.early.lodging)} ·
      {' '}{text('Miembro', 'Member')}: {equivalent(tariffs.member.pass)} / {equivalent(tariffs.member.lodging)}.
      <span className={styles.exchangeRateMeta}>
        {' '}
        {usingFallback
          ? text(
              `Tasa de referencia: COP ${cop.format(rate)} = US$1.`,
              `Reference rate: COP ${cop.format(rate)} = US$1.`
            )
          : text(
              `Tasa informativa actual: COP ${cop.format(rate)} = US$1${asOf ? ` (${asOf})` : ''}.`,
              `Current indicative rate: COP ${cop.format(rate)} = US$1${asOf ? ` (${asOf})` : ''}.`
            )}
        {' '}
        {text('El cobro se confirma en COP.', 'Charges are confirmed in COP.')}
        {' '}
        <a href="https://www.exchangerate-api.com/" target="_blank" rel="noreferrer">
          ExchangeRate-API
        </a>
      </span>
    </p>
  );
}
