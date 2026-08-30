import { saveTag } from "@/app/admin/actions/taxonomy";
import { ActionForm } from "@/app/admin/components/ActionForm";
import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../content.module.css";

export const metadata = { title: "Etiquetas" };

export default async function AdminTagsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [tagsResult, translationsResult] = await Promise.all([
    supabase.from("blog_tags").select("*").order("code"),
    supabase.from("blog_tag_translations").select("*"),
  ]);
  if (tagsResult.error) throw new Error(tagsResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  const byTag = new Map<string, typeof translationsResult.data>();
  translationsResult.data.forEach((translation) => byTag.set(translation.tag_id, [...(byTag.get(translation.tag_id) ?? []), translation]));

  const formFields = (tag?: (typeof tagsResult.data)[number]) => {
    const translations = tag ? byTag.get(tag.id) ?? [] : [];
    const es = translations.find((item) => item.locale === "es");
    const en = translations.find((item) => item.locale === "en");
    return <>
      <input type="hidden" name="id" value={tag?.id ?? ""} />
      <div className={styles.fields3}>
        <label className={styles.field}><span>Código *</span><input name="code" required defaultValue={tag?.code ?? ""} /></label>
        <label className={styles.field}><span>Nombre español *</span><input name="nameEs" required defaultValue={es?.name ?? ""} /></label>
        <label className={styles.field}><span>English name *</span><input name="nameEn" required defaultValue={en?.name ?? ""} /></label>
        <label className={styles.field}><span>Slug español</span><input name="slugEs" defaultValue={es?.slug ?? ""} /></label>
        <label className={styles.field}><span>English slug</span><input name="slugEn" defaultValue={en?.slug ?? ""} /></label>
      </div>
    </>;
  };

  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Descubrimiento</span><h1>Etiquetas</h1><p>Añade temas transversales para búsqueda, navegación y SEO.</p></div></header>
    <div className={styles.mainColumn}>
      <ActionForm action={saveTag} className={styles.card} submitLabel="Crear etiqueta"><h2>Nueva etiqueta</h2>{formFields()}</ActionForm>
      {tagsResult.data.map((tag) => <ActionForm key={tag.id} action={saveTag} className={styles.card} submitLabel="Actualizar"><h2>{byTag.get(tag.id)?.find((item) => item.locale === "es")?.name ?? tag.code}</h2>{formFields(tag)}</ActionForm>)}
    </div>
  </div>;
}
