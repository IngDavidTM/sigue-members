/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { sanitizeRichText } from "@/lib/content/admin-utils";
import type { BlogPostTranslationRow, EventTranslationRow } from "@/types/supabase";
import styles from "@/app/components/content/ContentPages.module.css";
import adminStyles from "../content.module.css";

type Props = {
  editUrl: string;
  image: string | null;
  translations: (BlogPostTranslationRow | EventTranslationRow)[];
  locale: string;
};

export function ContentPreview({ editUrl, image, translations, locale }: Props) {
  const translation = translations.find((item) => item.locale === locale) ?? translations[0];
  if (!translation) return <p>No hay una traducción guardada para previsualizar.</p>;
  return <div className={adminStyles.page}>
    <header className={adminStyles.pageHeader}>
      <div><h1>Vista previa guardada</h1><p>Esta vista es privada. Guarda los cambios en el editor para verlos aquí.</p></div>
      <Link href={editUrl} className={adminStyles.secondaryLink}>Volver a editar</Link>
    </header>
    <nav aria-label="Idioma de la vista previa">
      <Link href={`${editUrl}/preview?locale=es`}>Español</Link>{" · "}<Link href={`${editUrl}/preview?locale=en`}>English</Link>
    </nav>
    <article className={adminStyles.card} lang={translation.locale}>
      <h2>{translation.title}</h2>
      {translation.excerpt ? <p>{translation.excerpt}</p> : null}
      {image ? <img className={styles.featured} src={image} alt={translation.image_alt || translation.title} /> : null}
      <div className={styles.richText} dangerouslySetInnerHTML={{ __html: sanitizeRichText(translation.content_html) }} />
      {'agenda_html' in translation && translation.agenda_html ? <><h2>Agenda</h2><div className={styles.richText} dangerouslySetInnerHTML={{ __html: sanitizeRichText(translation.agenda_html) }} /></> : null}
    </article>
  </div>;
}
