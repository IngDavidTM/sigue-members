import { saveSeries } from "@/app/admin/actions/taxonomy";
import { ActionForm } from "@/app/admin/components/ActionForm";
import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../content.module.css";

export const metadata = { title: "Series de blog" };

export default async function AdminSeriesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [seriesResult, translationsResult] = await Promise.all([
    supabase.from("blog_series").select("*").order("sort_order"),
    supabase.from("blog_series_translations").select("*"),
  ]);
  if (seriesResult.error) throw new Error(seriesResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  const bySeries = new Map<string, typeof translationsResult.data>();
  translationsResult.data.forEach((translation) => {
    bySeries.set(translation.series_id, [...(bySeries.get(translation.series_id) ?? []), translation]);
  });

  const renderFields = (series?: (typeof seriesResult.data)[number]) => {
    const translations = series ? bySeries.get(series.id) ?? [] : [];
    const es = translations.find((item) => item.locale === "es");
    const en = translations.find((item) => item.locale === "en");
    return <>
      <input type="hidden" name="id" value={series?.id ?? ""} />
      <div className={styles.fields3}>
        <label className={styles.field}><span>Código interno *</span><input name="code" required defaultValue={series?.code ?? ""} placeholder="sigue-profundiza" /></label>
        <label className={styles.field}><span>Serie padre</span><select name="parentId" defaultValue={series?.parent_id ?? ""}><option value="">Ninguna</option>{seriesResult.data.filter((option) => option.id !== series?.id).map((option) => <option key={option.id} value={option.id}>{bySeries.get(option.id)?.find((item) => item.locale === "es")?.name ?? option.code}</option>)}</select></label>
        <label className={styles.field}><span>Orden</span><input name="sortOrder" type="number" min="0" defaultValue={series?.sort_order ?? 0} /></label>
      </div>
      <div className={styles.fields2}>
        <div className={styles.fields}>
          <label className={styles.field}><span>Nombre español *</span><input name="nameEs" required defaultValue={es?.name ?? ""} /></label>
          <label className={styles.field}><span>Slug español</span><input name="slugEs" defaultValue={es?.slug ?? ""} /></label>
          <label className={styles.field}><span>Descripción</span><textarea name="descriptionEs" defaultValue={es?.description ?? ""} /></label>
          <label className={styles.field}><span>Título SEO</span><input name="seoTitleEs" defaultValue={es?.seo_title ?? ""} /></label>
          <label className={styles.field}><span>Descripción SEO</span><textarea name="seoDescriptionEs" defaultValue={es?.seo_description ?? ""} /></label>
        </div>
        <div className={styles.fields}>
          <label className={styles.field}><span>English name *</span><input name="nameEn" required defaultValue={en?.name ?? ""} /></label>
          <label className={styles.field}><span>English slug</span><input name="slugEn" defaultValue={en?.slug ?? ""} /></label>
          <label className={styles.field}><span>Description</span><textarea name="descriptionEn" defaultValue={en?.description ?? ""} /></label>
          <label className={styles.field}><span>SEO title</span><input name="seoTitleEn" defaultValue={en?.seo_title ?? ""} /></label>
          <label className={styles.field}><span>SEO description</span><textarea name="seoDescriptionEn" defaultValue={en?.seo_description ?? ""} /></label>
        </div>
      </div>
    </>;
  };

  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Organización editorial</span><h1>Series y categorías</h1><p>Crea una jerarquía padre/hijo para agrupar los artículos.</p></div></header>
    <div className={styles.mainColumn}>
      <ActionForm action={saveSeries} className={styles.card} submitLabel="Crear serie"><h2>Nueva serie</h2>{renderFields()}</ActionForm>
      {seriesResult.data.map((series) => <ActionForm key={series.id} action={saveSeries} className={styles.card} submitLabel="Actualizar serie"><h2>{bySeries.get(series.id)?.find((item) => item.locale === "es")?.name ?? series.code}</h2>{renderFields(series)}</ActionForm>)}
    </div>
  </div>;
}
