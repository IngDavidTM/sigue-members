"use client";

import { useId, useState } from "react";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, ImageIcon, Italic, Link as LinkIcon, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { isAllowedImageUrl } from "@/lib/content/admin-validation";
import { uploadContentImage } from "@/lib/content/media-upload";
import { MediaField } from "./MediaField";
import { useFormActivity } from "./FormActivity";
import styles from "./admin-components.module.css";

type Props = { name: string; initialContent?: string | null; label: string; placeholder?: string };

export function RichTextEditor({ name, initialContent = "", label, placeholder }: Props) {
  const [html, setHtml] = useState(initialContent ?? "");
  const [error, setError] = useState("");
  const [imagePanel, setImagePanel] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [editingImage, setEditingImage] = useState(false);
  const id = useId();
  const activity = useFormActivity();
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true, linkOnPaste: true } }),
      Image.configure({ allowBase64: false, inline: false }),
      TableKit,
      Placeholder.configure({ placeholder: placeholder ?? "Escribe el contenido…" }),
    ],
    content: initialContent ?? "",
    editorProps: {
      attributes: { role: "textbox", "aria-multiline": "true", "aria-label": label, id },
      handlePaste: (_view, event) => {
        const file = [...(event.clipboardData?.files ?? [])].find((item) => item.type.startsWith("image/"));
        if (!file) return false;
        void pasteImage(file);
        return true;
      },
    },
    onUpdate: ({ editor: current }) => {
      setHtml(current.isEmpty ? "" : current.getHTML());
      activity.markChanged();
      requestAnimationFrame(() => window.dispatchEvent(new Event("admin-content-change")));
    },
  });
  const selection = useEditorState({ editor, selector: ({ editor: current }) => ({
    bold: current?.isActive("bold"), italic: current?.isActive("italic"),
    heading2: current?.isActive("heading", { level: 2 }), heading3: current?.isActive("heading", { level: 3 }),
    bullet: current?.isActive("bulletList"), ordered: current?.isActive("orderedList"),
    quote: current?.isActive("blockquote"), link: current?.isActive("link"),
  }) });
  async function pasteImage(file: File) {
    if (!editor || activity.busy) return;
    activity.setUploading(id, true);
    setError("");
    try {
      const url = await uploadContentImage(file);
      setImageUrl(url);
      setImageAlt("");
      setEditingImage(false);
      setImagePanel(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo subir la imagen."); }
    finally { activity.setUploading(id, false); }
  }
  const setLink = () => {
    if (!editor) return;
    const url = window.prompt("URL del enlace (deja vacío para quitarlo)", editor.getAttributes("link").href ?? "https://");
    if (url === null) return;
    if (!url.trim()) { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    try {
      if (!["https:", "http:", "mailto:", "tel:"].includes(new URL(url.trim()).protocol)) throw new Error();
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
      setError("");
    } catch { setError("Introduce un enlace válido con https://, http://, mailto: o tel:."); }
  };
  const openImage = () => {
    if (!editor) return;
    const selected = editor.isActive("image");
    setEditingImage(selected);
    setImageUrl(selected ? editor.getAttributes("image").src ?? "" : "");
    setImageAlt(selected ? editor.getAttributes("image").alt ?? "" : "");
    setImagePanel(true);
  };
  const applyImage = () => {
    if (!editor || !isAllowedImageUrl(imageUrl)) { setError("Sube una imagen o introduce una URL pública WebP o AVIF."); return; }
    if (!imageAlt.trim()) { setError("Describe la imagen para accesibilidad y SEO."); return; }
    if (editingImage) editor.chain().focus().updateAttributes("image", { src: imageUrl, alt: imageAlt.trim() }).run();
    else editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt.trim() }).run();
    setImagePanel(false);
    setError("");
  };
  return <div className={styles.editorField}>
    <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
    <div className={styles.editorToolbar} role="toolbar" aria-label={`Formato de ${label}`}>
      <button type="button" disabled={!editor || activity.busy} aria-pressed={selection?.bold ?? false} onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Negrita"><Bold /></button>
      <button type="button" disabled={!editor || activity.busy} aria-pressed={selection?.italic ?? false} onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Cursiva"><Italic /></button>
      <button type="button" disabled={!editor || activity.busy} aria-pressed={selection?.heading2 ?? false} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Título 2"><Heading2 /></button>
      <button type="button" disabled={!editor || activity.busy} aria-pressed={selection?.heading3 ?? false} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Título 3"><Heading3 /></button>
      <button type="button" disabled={!editor || activity.busy} aria-pressed={selection?.bullet ?? false} onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Lista"><List /></button>
      <button type="button" disabled={!editor || activity.busy} aria-pressed={selection?.ordered ?? false} onClick={() => editor?.chain().focus().toggleOrderedList().run()} aria-label="Lista numerada"><ListOrdered /></button>
      <button type="button" disabled={!editor || activity.busy} aria-pressed={selection?.quote ?? false} onClick={() => editor?.chain().focus().toggleBlockquote().run()} aria-label="Cita"><Quote /></button>
      <button type="button" disabled={!editor || activity.busy} aria-pressed={selection?.link ?? false} onClick={setLink} aria-label="Enlace"><LinkIcon /></button>
      <button type="button" disabled={!editor || activity.busy} onClick={openImage} aria-label="Insertar o editar imagen"><ImageIcon /></button>
      <button type="button" disabled={!editor || activity.busy} onClick={() => editor?.chain().focus().undo().run()} aria-label="Deshacer"><Undo2 /></button>
      <button type="button" disabled={!editor || activity.busy} onClick={() => editor?.chain().focus().redo().run()} aria-label="Rehacer"><Redo2 /></button>
    </div>
    {imagePanel ? <div className={styles.imagePanel} role="group" aria-label="Configurar imagen">
      <MediaField key={`${imagePanel}-${editingImage}`} name={`${name}ImageDraft`} label="Imagen del contenido" initialValue={imageUrl} onChange={setImageUrl} />
      <label className={styles.fieldLabel}>Descripción de la imagen (texto alternativo)
        <input className={styles.urlInput} value={imageAlt} maxLength={180} onChange={(event) => setImageAlt(event.target.value)} placeholder="Describe lo que se ve en la imagen" />
      </label>
      <div className={styles.imageActions}>
        <button type="button" disabled={activity.busy} onClick={applyImage}>{editingImage ? "Actualizar imagen" : "Insertar imagen"}</button>
        {editingImage ? <button type="button" disabled={activity.busy} onClick={() => { editor?.chain().focus().deleteSelection().run(); setImagePanel(false); }}>Quitar imagen</button> : null}
        <button type="button" disabled={activity.busy} onClick={() => setImagePanel(false)}>Cancelar</button>
      </div>
    </div> : null}
    <EditorContent editor={editor} className={styles.editor} />
    <input type="hidden" name={name} value={html} />
    <small>Puedes pegar una foto desde el portapapeles. Para editarla o quitarla, selecciónala y pulsa el botón de imagen.</small>
    {error ? <small className={styles.inlineError} role="alert">{error}</small> : null}
  </div>;
}
