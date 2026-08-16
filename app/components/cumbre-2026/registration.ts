export const tariffs = {
  general: { label: 'Tarifa General', pass: 599000, lodging: 836000 },
  early: { label: 'Early Bird', pass: 489000, lodging: 711000 },
  member: { label: 'Miembro Activo SIGUE', pass: 449000, lodging: 652000 },
} as const;

export type Tariff = keyof typeof tariffs;

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
