import { saveBlogPost } from "@/app/admin/actions/blogs";
import { isoToZonedInput } from "@/lib/content/admin-utils";
import type {
  BlogPostRow,
  BlogPostTranslationRow,
  BlogSeriesRow,
  BlogSeriesTranslationRow,
  BlogTagRow,
  BlogTagTranslationRow,
} from "@/types/supabase";

import contentStyles from "../content.module.css";
import { ActionForm } from "./ActionForm";
import { MediaField } from "./MediaField";
import { RichTextEditor } from "./RichTextEditor";
import { SeoAssistant } from "./SeoAssistant";

type Translation = BlogPostTranslationRow | undefined;
type SeriesOption = BlogSeriesRow & { translation?: BlogSeriesTranslationRow };
type TagOption = BlogTagRow & { translation?: BlogTagTranslationRow };

type Props = {
  post?: BlogPostRow;
  translations?: BlogPostTranslationRow[];
  series: SeriesOption[];
  tags: TagOption[];
  selectedTagIds?: string[];
};

function LocaleFields({ locale, translation }: { locale: "es" | "en"; translation: Translation }) {
  const suffix = locale === "es" ? "Es" : "En";
  const language = locale === "es" ? "Español" : "English";
  return (
    <section className={`${contentStyles.card} ${contentStyles.localeCard}`} data-locale={locale}>
      <div className={contentStyles.localeHeading}>
        <h2>{language}</h2><span>{locale.toUpperCase()}</span>
      </div>
      <div className={contentStyles.fields2}>
        <label className={contentStyles.field}>
          <span>Título *</span>
          <input name={`title${suffix}`} required minLength={3} defaultValue={translation?.title ?? ""} />
        </label>
        <label className={contentStyles.field}>
          <span>Slug</span>
          <input name={`slug${suffix}`} defaultValue={translation?.slug ?? ""} placeholder="Se genera desde el título" />
        </label>
      </div>
      <label className={contentStyles.field}>
        <span>Resumen</span>
        <textarea name={`excerpt${suffix}`} defaultValue={translation?.excerpt ?? ""} maxLength={500} />
      </label>
      <RichTextEditor
        name={`content${suffix}`}
        label="Contenido *"
        initialContent={translation?.content_html}
      />
      <label className={contentStyles.field}>
        <span>Texto alternativo de la imagen</span>
        <input name={`imageAlt${suffix}`} defaultValue={translation?.image_alt ?? ""} />
      </label>

      <details className={contentStyles.seoDetails}>
        <summary>SEO y datos para buscadores</summary>
        <div>
          <div className={contentStyles.fields2}>
            <label className={contentStyles.field}><span>Título SEO (máx. 60)</span><input name={`seoTitle${suffix}`} defaultValue={translation?.seo_title ?? ""} maxLength={60} /></label>
            <label className={contentStyles.field}><span>Frase clave</span><input name={`focusKeyphrase${suffix}`} defaultValue={translation?.focus_keyphrase ?? ""} maxLength={100} /></label>
          </div>
          <label className={contentStyles.field}><span>Descripción SEO (máx. 160)</span><textarea name={`seoDescription${suffix}`} defaultValue={translation?.seo_description ?? ""} maxLength={160} /></label>
          <label className={contentStyles.field}><span>URL canónica</span><input type="url" name={`canonicalUrl${suffix}`} defaultValue={translation?.canonical_url ?? ""} /></label>
          <div className={contentStyles.fields2}>
            <label className={contentStyles.field}><span>Título para redes</span><input name={`ogTitle${suffix}`} maxLength={60} defaultValue={translation?.og_title ?? ""} /></label>
            <MediaField name={`ogImageUrl${suffix}`} label="Imagen para redes (opcional)" initialValue={translation?.og_image_url} />
          </div>
          <label className={contentStyles.field}><span>Descripción para redes</span><textarea name={`ogDescription${suffix}`} maxLength={200} defaultValue={translation?.og_description ?? ""} /></label>
          <label className={contentStyles.field}>
            <span>Tipo Schema.org</span>
            <select name={`schemaType${suffix}`} defaultValue={translation?.schema_type ?? "BlogPosting"}>
              <option value="BlogPosting">BlogPosting</option><option value="Article">Article</option><option value="NewsArticle">NewsArticle</option>
            </select>
          </label>
          <label className={contentStyles.checkbox}><input type="checkbox" name={`noindex${suffix}`} defaultChecked={translation?.noindex} /> No indexar esta versión</label>
          <label className={contentStyles.checkbox}><input type="checkbox" name={`nofollow${suffix}`} defaultChecked={translation?.nofollow} /> No seguir enlaces</label>
          <SeoAssistant suffix={suffix} />
        </div>
      </details>
    </section>
  );
}

export function BlogForm({ post, translations = [], series, tags, selectedTagIds = [] }: Props) {
  const es = translations.find((translation) => translation.locale === "es");
  const en = translations.find((translation) => translation.locale === "en");
  const publicationTimezone = "America/Bogota";
  const publicationValue = isoToZonedInput(post?.published_at ?? null, publicationTimezone);

  return (
    <ActionForm action={saveBlogPost} className={contentStyles.form} submitLabel={post ? "Actualizar blog" : "Crear blog"}>
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="expectedUpdatedAt" value={post?.updated_at ?? ""} />
      <div className={contentStyles.mainColumn}>
        <LocaleFields locale="es" translation={es} />
        <LocaleFields locale="en" translation={en} />
      </div>
      <aside className={contentStyles.sideColumn}>
        <section className={contentStyles.card}>
          <h3>Publicación</h3>
          <div className={contentStyles.fields}>
            <label className={contentStyles.field}><span>Estado</span><select name="status" defaultValue={post?.status === "scheduled" && post.published_at && new Date(post.published_at) <= new Date() ? "published" : post?.status ?? "draft"}><option value="draft">Borrador</option><option value="scheduled">Programado</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
            <label className={contentStyles.field}><span>Autor visible</span><input name="authorName" defaultValue={post?.author_name ?? "SIGUE Network"} /></label>
            <label className={contentStyles.field}><span>Fecha de publicación (vacía = ahora al publicar)</span><input type="datetime-local" name="publishedAt" defaultValue={publicationValue} /></label>
            <label className={contentStyles.field}><span>Zona horaria</span><select name="publicationTimezone" defaultValue={publicationTimezone}><option value="America/Bogota">America/Bogota</option><option value="America/Guayaquil">America/Guayaquil</option><option value="America/New_York">America/New_York</option><option value="UTC">UTC</option></select></label>
            <label className={contentStyles.checkbox}><input type="checkbox" name="isFeatured" defaultChecked={post?.is_featured} /> Destacar en portada</label>
            <label className={contentStyles.checkbox}><input type="checkbox" name="allowComments" defaultChecked={post?.allow_comments ?? true} /> Permitir comentarios</label>
          </div>
        </section>
        <section className={contentStyles.card}>
          <h3>Clasificación</h3>
          <label className={contentStyles.field}><span>Serie o categoría</span><select name="seriesId" defaultValue={post?.series_id ?? ""}><option value="">Sin serie</option>{series.map((item) => <option key={item.id} value={item.id}>{item.translation?.name ?? item.code}</option>)}</select></label>
          <div className={contentStyles.tagGrid}>{tags.length ? tags.map((tag) => <label className={contentStyles.checkbox} key={tag.id}><input type="checkbox" name="tagIds" value={tag.id} defaultChecked={selectedTagIds.includes(tag.id)} /> {tag.translation?.name ?? tag.code}</label>) : <small>Aún no hay etiquetas.</small>}</div>
        </section>
        <section className={contentStyles.card}>
          <MediaField name="featuredImageUrl" label="Imagen destacada" initialValue={post?.featured_image_url} />
        </section>
      </aside>
    </ActionForm>
  );
}
