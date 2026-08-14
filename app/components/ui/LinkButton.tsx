import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  label: string;
  subLabel?: string;
  href: string;
  variant?: ButtonVariant;
  className?: string;
}

const fontHeebo = 'var(--font-heebo), Heebo, sans-serif';

const variantBg: Record<ButtonVariant, string> = {
  primary: '#EF1351',
  secondary: '#5D17EB',
};

export default function LinkButton({
  label,
  subLabel,
  href,
  variant = 'secondary',
  className = '',
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-block text-white leading-snug hover:opacity-90 transition-opacity ${className}`}
      style={{
        background: variantBg[variant],
        padding: '12px 16px',
        fontFamily: fontHeebo,
        fontSize: 14,
        textDecoration: 'none',
      }}
    >
      <strong style={{ fontWeight: 700 }}>{label}</strong>
      {subLabel && <> {subLabel}</>}
    </Link>
  );
}
