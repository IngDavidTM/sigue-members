import styles from './DonationEmbed.module.css';

type Locale = 'es' | 'en';

const donationFormUrl = 'https://www.zeffy.com/embed/donation-form/84423d60-a0ab-4424-a8b5-048d5800a8e6';

export default function DonationEmbed({ locale }: { locale: Locale }) {
  const title = locale === 'es'
    ? 'Formulario seguro de donación impulsado por Zeffy'
    : 'Secure donation form powered by Zeffy';

  return (
    <main className={styles.page} data-donation-page>
      <div className={styles.embed}>
        <iframe
          title={title}
          src={donationFormUrl}
          allow="payment *"
        />
      </div>
    </main>
  );
}
