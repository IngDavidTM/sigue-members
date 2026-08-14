'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRegistration } from './RegistrationControls';
import { money, tariffs, type Tariff } from './registration';
import styles from './CumbreLanding.module.css';

export default function RegistrationForm({ locale = 'es' }: { locale?: 'es' | 'en' }) {
  const { tariff, setTariff, withLodging, setWithLodging } = useRegistration();
  const [notice, setNotice] = useState('');
  const english = locale === 'en';
  const text = (spanish: string, englishText: string) => (english ? englishText : spanish);
  const tariffLabel = (key: Tariff) => {
    if (key === 'general') return text('Tarifa General', 'General Rate');
    if (key === 'member') return text('Miembro Activo SIGUE', 'Active SIGUE Member');
    return 'Early Bird';
  };

  const total = useMemo(
    () => (withLodging ? tariffs[tariff].lodging : tariffs[tariff].pass),
    [tariff, withLodging]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(
      text('Inscripción Cumbre SIGUE Network 2026', 'SIGUE Network Summit 2026 Registration')
    );
    const body = encodeURIComponent(
      [
        `${text('Nombre', 'Name')}: ${form.get('name')}`,
        `${text('Organización', 'Organization')}: ${form.get('organization')}`,
        `${text('Cargo', 'Role')}: ${form.get('role')}`,
        `${text('Ciudad / País', 'City / Country')}: ${form.get('city')}`,
        `Email: ${form.get('email')}`,
        `WhatsApp: ${form.get('whatsapp')}`,
        `${text('Tarifa', 'Rate')}: ${tariffLabel(tariff)}`,
        `${text('Hospedaje', 'Lodging')}: ${withLodging ? text('Sí', 'Yes') : 'No'}`,
        `Total: ${money[locale].format(total)}`,
      ].join('\n')
    );

    setNotice(
      text(
        'Tu solicitud está lista. Confirma el envío en la aplicación de correo que se abrió.',
        'Your request is ready. Confirm it in the email application that opened.'
      )
    );
    window.location.href = `mailto:contacto@siguenetwork.org?subject=${subject}&body=${body}`;
  };

  return (
    <form className={styles.registrationForm} onSubmit={handleSubmit}>
      <div className={styles.formFields}>
        <h3>{text('Tus datos', 'Your information')}</h3>
        <div className={styles.fieldGrid}>
          <label>
            {text('Nombre completo', 'Full name')}
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            {text('Organización', 'Organization')}
            <input name="organization" type="text" autoComplete="organization" required />
          </label>
          <label>
            {text('Cargo', 'Role')}
            <input name="role" type="text" autoComplete="organization-title" required />
          </label>
          <label>
            {text('Ciudad / País', 'City / Country')}
            <input name="city" type="text" autoComplete="address-level2" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            WhatsApp
            <input name="whatsapp" type="tel" autoComplete="tel" required />
          </label>
        </div>

        <fieldset className={styles.tariffSelector}>
          <legend>{text('Selecciona tu tarifa', 'Select your rate')}</legend>
          <div>
            {(Object.keys(tariffs) as Tariff[]).map((key) => (
              <label key={key} className={tariff === key ? styles.selectedOption : undefined}>
                <input
                  type="radio"
                  name="tariff"
                  value={key}
                  checked={tariff === key}
                  onChange={() => setTariff(key)}
                />
                <span>{tariffLabel(key)}</span>
                <strong>{money[locale].format(tariffs[key].pass)}</strong>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.lodgingSelector}>
          <legend>{text('Hospedaje', 'Lodging')}</legend>
          <div>
            <label className={!withLodging ? styles.selectedOption : undefined}>
              <input
                type="radio"
                name="lodging"
                value="no"
                checked={!withLodging}
                onChange={() => setWithLodging(false)}
              />
              <span>
                {text('No, gracias', 'No, thank you')}
                <small>{text('Solo Pase Cumbre', 'Summit Pass only')}</small>
              </span>
            </label>
            <label className={withLodging ? styles.selectedOption : undefined}>
              <input
                type="radio"
                name="lodging"
                value="yes"
                checked={withLodging}
                onChange={() => setWithLodging(true)}
              />
              <span>
                {text('Sí, con hospedaje', 'Yes, with lodging')}
                <small>{text('Noches del 27 y 28', 'Nights of October 27 and 28')}</small>
              </span>
            </label>
          </div>
        </fieldset>
      </div>

      <aside className={styles.formSummary} aria-live="polite">
        <h3>{text('Resumen', 'Summary')}</h3>
        <dl>
          <div>
            <dt>{text('Pase Cumbre', 'Summit Pass')}</dt>
            <dd>{tariffLabel(tariff)}</dd>
          </div>
          <div>
            <dt>{text('Hospedaje', 'Lodging')}</dt>
            <dd>{withLodging ? text('Incluido', 'Included') : text('No incluido', 'Not included')}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{money[locale].format(total)}</dd>
          </div>
        </dl>
        <p>{text('El total corresponde a la opción seleccionada y será confirmado por el equipo SIGUE.', 'The total reflects your selected option and will be confirmed by the SIGUE team.')}</p>
        <button type="submit">{text('Preparar correo de inscripción', 'Prepare registration email')}</button>
        <small className={styles.emailDisclosure}>
          {text(
            'Este formulario prepara un correo con tus datos; la solicitud se envía cuando la confirmas en tu aplicación de correo.',
            'This form prepares an email with your information; the request is sent when you confirm it in your email application.'
          )}
        </small>
        {notice ? <p className={styles.formNotice}>{notice}</p> : null}
      </aside>
    </form>
  );
}
