import styles from './CumbreLanding.module.css';
import { dayPass } from './registration';

const usdPrices = {
  general: { pass: 200, lodging: 267 },
  early: { pass: 163, lodging: 230 },
  member: { pass: 150, lodging: 217 },
} as const;

export default function UsdEquivalents({ locale }: { locale: 'es' | 'en' }) {
  const english = locale === 'en';
  const text = (spanish: string, englishText: string) => (english ? englishText : spanish);
  const usd = (amount: number) => `US$${amount}`;
  const lodging = text('con hospedaje', 'with lodging');
  const passOnly = text('sin hospedaje', 'without lodging');

  return (
    <p className={styles.exchangeNote}>
      <strong>{text('Valores fijos en USD', 'Fixed USD prices')}</strong> —
      {' '}{text('General', 'General')}: {usd(usdPrices.general.pass)} {passOnly} / {usd(usdPrices.general.lodging)} {lodging} ·
      {' '}Early Bird: {usd(usdPrices.early.pass)} {passOnly} / {usd(usdPrices.early.lodging)} {lodging} ·
      {' '}{text('Miembro', 'Member')}: {usd(usdPrices.member.pass)} {passOnly} / {usd(usdPrices.member.lodging)} {lodging} ·
      {' '}{text('Pase diario', 'Day Pass')}: {usd(dayPass.usd)} {passOnly}.
      <span className={styles.exchangeRateMeta}>
        {' '}
        {text(
          'Estos valores corresponden a las opciones de inscripción en Zeffy.',
          'These prices correspond to the registration options on Zeffy.'
        )}
      </span>
    </p>
  );
}
