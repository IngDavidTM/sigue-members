import DynamicForm from './DynamicForm';
import type { PublishedDynamicForm } from '@/types/supabase';
import styles from './LeadCaptureSection.module.css';

export default function LeadCaptureSection({ id, form, locale, sourcePath }: {
  id: string;
  form: PublishedDynamicForm;
  locale: 'es' | 'en';
  sourcePath: string;
}) {
  return <section id={id} className={styles.section}>
    <DynamicForm {...form} locale={locale} sourcePath={sourcePath} />
  </section>;
}
