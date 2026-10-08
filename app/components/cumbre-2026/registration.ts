export const tariffs = {
  general: { label: 'Tarifa General', pass: 599000, lodging: 836000 },
  member: { label: 'Miembro Activo SIGUE', pass: 449000, lodging: 652000 },
} as const;

export type Tariff = keyof typeof tariffs;

export const dayPass = { cop: 199000, usd: 66 } as const;

export const summitDays = [
  { value: '27', es: '27 de octubre · tarde', en: 'October 27 · afternoon' },
  { value: '28', es: '28 de octubre', en: 'October 28' },
  { value: '29', es: '29 de octubre', en: 'October 29' },
] as const;

export const money = {
  es: new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }),
  en: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }),
};
