import styles from './CumbreLanding.module.css';

const zeffyCampaignUrl = 'https://www.zeffy.com/en-US/ticketing/2nd-conference-sigue-network';

export default function RegistrationForm({ locale = 'es' }: { locale?: 'es' | 'en' }) {
  const english = locale === 'en';
  const text = (spanish: string, englishText: string) => (english ? englishText : spanish);

  return (
    <div className={styles.registrationForm}>
      <div className={styles.formFields}>
        <h3>{text('Inscripción en línea', 'Online registration')}</h3>
        <p className={styles.zeffyIntro}>
          {text(
            'Completa tu inscripción y pago seguro directamente en Zeffy.',
            'Complete your registration and secure payment directly through Zeffy.'
          )}
        </p>
        <ul className={styles.zeffyFeatures}>
          <li>{text('Elige una de las seis opciones de pase y hospedaje.', 'Choose from the six Summit pass and lodging options.')}</li>
          <li>{text('Registra tus datos de contacto y organización.', 'Enter your contact and organization details.')}</li>
          <li>{text('Recibe la confirmación de tu inscripción por correo.', 'Receive your registration confirmation by email.')}</li>
        </ul>
        <p className={styles.zeffyNote}>
          {text(
            'Zeffy gestiona de forma segura la inscripción, el pago y la confirmación de tu cupo.',
            'Zeffy securely manages your registration, payment, and place confirmation.'
          )}
        </p>
      </div>

      <aside className={styles.formSummary}>
        <h3>{text('Tu cupo te espera', 'Your spot is waiting')}</h3>
        <dl>
          <div>
            <dt>{text('Evento', 'Event')}</dt>
            <dd>{text('Cumbre SIGUE Network 2026', 'SIGUE Network Summit 2026')}</dd>
          </div>
          <div>
            <dt>{text('Fechas', 'Dates')}</dt>
            <dd>{text('27–29 de octubre', 'October 27–29')}</dd>
          </div>
          <div>
            <dt>{text('Lugar', 'Venue')}</dt>
            <dd>CELAM · Bogotá</dd>
          </div>
        </dl>
        <a className={styles.zeffyCheckout} href={zeffyCampaignUrl}>
          {text('Inscribirme y pagar en Zeffy', 'Register and pay on Zeffy')}
        </a>
        <small className={styles.emailDisclosure}>
          {text(
            'Serás dirigido a Zeffy para seleccionar tu entrada y completar el pago seguro.',
            'You will be directed to Zeffy to select your ticket and complete secure payment.'
          )}
        </small>
      </aside>
    </div>
  );
}
