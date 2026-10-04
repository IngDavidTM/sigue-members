'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRegistration } from './RegistrationControls';
import { dayPass, money, summitDays, tariffs, type Tariff } from './registration';
import styles from './CumbreLanding.module.css';

const zeffyCampaignUrl = 'https://www.zeffy.com/en-US/ticketing/2nd-conference-sigue-network';

export default function RegistrationForm({ locale = 'es' }: { locale?: 'es' | 'en' }) {
  const { passType, setPassType, tariff, setTariff, withLodging, setWithLodging } = useRegistration();
  const [selectedDay, setSelectedDay] = useState<(typeof summitDays)[number]['value']>('27');
  const english = locale === 'en';
  const text = (spanish: string, englishText: string) => (english ? englishText : spanish);
  const tariffLabel = (key: Tariff) => {
    if (key === 'general') return text('Tarifa General', 'General Rate');
    if (key === 'member') return text('Miembro Activo SIGUE', 'Active SIGUE Member');
    return 'Early Bird';
  };
  const transferTotal = passType === 'day' ? dayPass.cop : withLodging ? tariffs[tariff].lodging : tariffs[tariff].pass;

  return (
    <div className={styles.registrationForm}>
      <header className={styles.paymentChoiceHeader}>
        <p>{text('Dos formas de pago', 'Two payment methods')}</p>
        <h3>{text('Elige cómo quieres pagar tu inscripción', 'Choose how you want to pay for your registration')}</h3>
        <span>
          {text(
            'Con tarjeta a través de Zeffy o mediante transferencia o depósito desde Colombia.',
            'By card through Zeffy, or by bank transfer or deposit from Colombia.'
          )}
        </span>
      </header>

      <div className={styles.paymentMethods}>
        <article className={`${styles.paymentMethodCard} ${styles.cardPayment}`}>
          <p className={styles.paymentMethodNumber}>{text('Opción 1 · Tarjeta', 'Option 1 · Card')}</p>
          <h4>{text('Pago con tarjeta en Zeffy', 'Card payment through Zeffy')}</h4>
          <p>
            {text(
              'Recomendado para pagos con tarjeta y para participantes fuera de Colombia.',
              'Recommended for card payments and participants outside Colombia.'
            )}
          </p>
          <ul className={styles.paymentFeatures}>
            <li>{text('Elige un pase completo o el pase diario de US$66 y selecciona tu día.', 'Choose a full Summit pass or the US$66 Day Pass and select your day.')}</li>
            <li>{text('Completa tus datos y el pago seguro en Zeffy.', 'Enter your information and complete secure payment through Zeffy.')}</li>
            <li>{text('Recibe la confirmación por correo.', 'Receive confirmation by email.')}</li>
          </ul>
          <a className={styles.paymentMethodButton} href={zeffyCampaignUrl}>
            {text('Pagar con tarjeta en Zeffy', 'Pay by card through Zeffy')}
          </a>
        </article>

        <article className={`${styles.paymentMethodCard} ${styles.transferPayment}`}>
          <p className={styles.paymentMethodNumber}>{text('Opción 2 · Colombia', 'Option 2 · Colombia')}</p>
          <h4>{text('Transferencia o depósito con Bre-B', 'Bank transfer or deposit through Bre-B')}</h4>
          <p>
            {text(
              'Calcula el valor exacto en pesos colombianos y realiza el pago desde tu entidad financiera.',
              'Calculate the exact amount in Colombian pesos and pay from your financial institution.'
            )}
          </p>

          <section className={styles.transferCalculator} aria-labelledby="transfer-calculator-title">
            <h5 id="transfer-calculator-title">{text('Calcula cuánto debes transferir', 'Calculate how much to transfer')}</h5>
            <div className={styles.calculatorPassType}>
              <label htmlFor="summit-pass-type">{text('Tipo de pase', 'Pass type')}</label>
              <select id="summit-pass-type" value={passType} onChange={(event) => setPassType(event.target.value as 'full' | 'day')}>
                <option value="full">{text('Cumbre completa · 3 días', 'Full Summit · 3 days')}</option>
                <option value="day">{text('Un solo día · COP $199.000', 'One day · COP $199,000')}</option>
              </select>
            </div>
            <div className={styles.calculatorControls}>
              {passType === 'day' ? (
                <label>
                  {text('Día de asistencia', 'Attendance day')}
                  <select value={selectedDay} onChange={(event) => setSelectedDay(event.target.value as typeof selectedDay)}>
                    {summitDays.map((day) => <option key={day.value} value={day.value}>{day[locale]}</option>)}
                  </select>
                </label>
              ) : (
                <>
                  <label>
                    {text('Tarifa', 'Rate')}
                    <select value={tariff} onChange={(event) => setTariff(event.target.value as Tariff)}>
                      {(Object.keys(tariffs) as Tariff[]).map((key) => (
                        <option key={key} value={key}>{tariffLabel(key)}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {text('Hospedaje', 'Lodging')}
                    <select value={withLodging ? 'yes' : 'no'} onChange={(event) => setWithLodging(event.target.value === 'yes')}>
                      <option value="no">{text('Sin hospedaje', 'Without lodging')}</option>
                      <option value="yes">{text('Con hospedaje', 'With lodging')}</option>
                    </select>
                  </label>
                </>
              )}
            </div>
            {passType === 'day' ? <p className={styles.dayPassHint}>{text('El pase diario no incluye hospedaje. Indica el mismo día al registrar tu pago.', 'The Day Pass does not include lodging. Include the selected day when submitting your payment details.')}</p> : null}
            <div className={styles.transferTotal} aria-live="polite">
              <span>{text('Total exacto a transferir', 'Exact amount to transfer')}</span>
              <strong>{money[locale].format(transferTotal)}</strong>
              <small>{text('Transfiere este valor en pesos colombianos.', 'Transfer this amount in Colombian pesos.')}</small>
            </div>
          </section>

          <div className={styles.breInfoGrid}>
            <div>
              <dl className={styles.breDetails}>
                <div><dt>{text('Llave Bre-B', 'Bre-B key')}</dt><dd>52104099</dd></div>
                <div><dt>{text('Titular', 'Account holder')}</dt><dd>Sandra Bibiana Prieto Garzón</dd></div>
                <div><dt>{text('Banco', 'Bank')}</dt><dd>Davivienda</dd></div>
                <div><dt>RUT</dt><dd>52104099</dd></div>
              </dl>
              <p className={styles.breVerification}>
                {text(
                  'Antes de confirmar, verifica que aparezca el nombre de Sandra Bibiana Prieto Garzón.',
                  'Before confirming, verify that the name Sandra Bibiana Prieto Garzón appears.'
                )}
              </p>
              <p className={styles.breConcept}>
                {text('Concepto o destino del pago:', 'Payment reference:')}
                <strong>CUMBRE SIGUE NETWORK 2026</strong>
              </p>
            </div>
            <figure className={styles.breQr}>
              <Image
                src="/images/cumbre-2026/pago-bre-b-qr.png"
                alt={text('Código QR Bre-B para pagar a Sandra Bibiana Prieto Garzón', 'Bre-B QR code to pay Sandra Bibiana Prieto Garzón')}
                width={882}
                height={1323}
                sizes="(max-width: 600px) 210px, 170px"
              />
              <figcaption>{text('Escanea el QR desde tu aplicación financiera.', 'Scan the QR code from your financial app.')}</figcaption>
              <a href="/downloads/codigo-qr-bre-b-sandra-prieto.pdf" download>
                {text('Descargar código QR', 'Download QR code')}
              </a>
            </figure>
          </div>

          <p className={styles.breReceipt}>
            {text('Después del pago, envía el comprobante, tu nombre completo y tus datos de facturación a ', 'After payment, send the receipt, your full name, and billing details to ')}
            <a href="mailto:info@siguenetwork.org">info@siguenetwork.org</a>.{' '}
            {passType === 'day' ? text('Indica también el día de asistencia seleccionado.', 'Also include your selected attendance day.') + ' ' : null}
            {text('Tu cupo y factura se confirman una vez verificado el pago.', 'Your place and invoice are confirmed once payment is verified.')}
          </p>
        </article>
      </div>
    </div>
  );
}
