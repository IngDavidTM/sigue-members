import styles from "../members.module.css";

type Option = { value: string; es: string; en: string };
type Locale = "es" | "en";

function Label({ label, hint, required, requiredText }: { label: string; hint?: string; required?: boolean; requiredText?: string }) {
  return <span className={styles.fieldLabel}>
    <span>{label}{required ? <abbr title={requiredText} aria-hidden="true"> *</abbr> : null}</span>
    {hint ? <small>{hint}</small> : null}
  </span>;
}

export function TextField({ name, label, hint, value, required, requiredText, type = "text", maxLength, multiline, placeholder, inputMode, autoComplete }: {
  name: string; label: string; hint?: string; value?: string | number | null; required?: boolean; requiredText?: string;
  type?: "text" | "email" | "url" | "tel" | "number"; maxLength?: number; multiline?: boolean; placeholder?: string;
  inputMode?: "numeric" | "url" | "email" | "tel"; autoComplete?: string;
}) {
  return <label className={styles.field}>
    <Label label={label} hint={hint} required={required} requiredText={requiredText} />
    {multiline
      ? <textarea name={name} defaultValue={value ?? ""} maxLength={maxLength} rows={4} placeholder={placeholder} aria-required={required || undefined} />
      : <input name={name} type={type} defaultValue={value ?? ""} maxLength={maxLength} placeholder={placeholder} inputMode={inputMode} autoComplete={autoComplete} aria-required={required || undefined} />}
  </label>;
}

export function SelectField({ name, label, hint, options, value, locale, chooseText, required, requiredText }: {
  name: string; label: string; hint?: string; options: Option[]; value?: string | null; locale: Locale; chooseText: string; required?: boolean; requiredText?: string;
}) {
  return <label className={styles.field}>
    <Label label={label} hint={hint} required={required} requiredText={requiredText} />
    <select name={name} defaultValue={value ?? ""} aria-required={required || undefined}>
      <option value="">{chooseText}</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option[locale]}</option>)}
    </select>
  </label>;
}

export function YesNoField({ name, label, value, yes, no }: { name: string; label: string; value: boolean | null | undefined; yes: string; no: string }) {
  const current = value === true ? "yes" : value === false ? "no" : "";
  return <fieldset className={styles.choiceGroup} data-field={name}>
    <legend className={styles.fieldLabel}>{label}</legend>
    <div className={styles.choices}>
      <label className={styles.choice}><input type="radio" name={name} value="yes" defaultChecked={current === "yes"} /> {yes}</label>
      <label className={styles.choice}><input type="radio" name={name} value="no" defaultChecked={current === "no"} /> {no}</label>
      <input type="radio" name={name} value="" defaultChecked={current === ""} hidden aria-hidden="true" tabIndex={-1} />
    </div>
  </fieldset>;
}

export function CheckboxGroup({ name, label, hint, options, values, locale, required, requiredText }: {
  name: string; label: string; hint?: string; options: Option[]; values: string[]; locale: Locale; required?: boolean; requiredText?: string;
}) {
  return <fieldset className={styles.choiceGroup} data-field={name}>
    <legend className={styles.fieldLabel}><span>{label}{required ? <abbr title={requiredText} aria-hidden="true"> *</abbr> : null}</span>{hint ? <small>{hint}</small> : null}</legend>
    <div className={styles.chips}>
      {options.map((option) => <label key={option.value} className={styles.chip}>
        <input type="checkbox" name={name} value={option.value} defaultChecked={values.includes(option.value)} />
        <span>{option[locale]}</span>
      </label>)}
    </div>
  </fieldset>;
}

export function PercentInput({ name, label, value }: { name: string; label: string; value: number | null | undefined }) {
  return <label className={styles.percentField}>
    <span>{label}</span>
    <span className={styles.percentInput}><input name={name} type="number" min={0} max={100} step={1} inputMode="numeric" defaultValue={value ?? ""} /><b aria-hidden="true">%</b></span>
  </label>;
}
