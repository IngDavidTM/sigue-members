"use client";

import { useState } from "react";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

import styles from "./admin-components.module.css";
import { isAllowedImageUrl } from "@/lib/content/admin-validation";

type Props = {
  name: string;
  initialContent?: string | null;
  label: string;
  placeholder?: string;
};

export function RichTextEditor({ name, initialContent = "", label, placeholder }: Props) {
  const [html, setHtml] = useState(initialContent ?? "");
  const [editorError, setEditorError] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true, linkOnPaste: true },
      }),
      Image.configure({ allowBase64: false, inline: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Escribe el contenido…" }),
    ],
    content: initialContent ?? "",
    onUpdate: ({ editor: currentEditor }) => {
      setHtml(currentEditor.getHTML());
      window.requestAnimationFrame(() => window.dispatchEvent(new Event("admin-content-change")));
    },
  });

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL del enlace", previous ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const setImage = () => {
    if (!editor) return;
    const url = window.prompt("URL pública .avif o .webp de la imagen", "https://");
    if (!url?.trim()) return;
    if (!isAllowedImageUrl(url.trim())) {
      setEditorError("La imagen insertada debe usar una URL pública que termine en .avif o .webp.");
      return;
    }
    setEditorError("");
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  return (
    <div className={styles.editorField}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.editorToolbar} role="toolbar" aria-label={`Formato de ${label}`}>
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Negrita"><Bold /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Cursiva"><Italic /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Título 2"><Heading2 /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Título 3"><Heading3 /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Lista"><List /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} aria-label="Lista numerada"><ListOrdered /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} aria-label="Cita"><Quote /></button>
        <button type="button" onClick={setLink} aria-label="Enlace"><LinkIcon /></button>
        <button type="button" onClick={setImage} aria-label="Imagen"><ImageIcon /></button>
        <button type="button" onClick={() => editor?.chain().focus().undo().run()} aria-label="Deshacer"><Undo2 /></button>
        <button type="button" onClick={() => editor?.chain().focus().redo().run()} aria-label="Rehacer"><Redo2 /></button>
      </div>
      <EditorContent editor={editor} className={styles.editor} />
      <input type="hidden" name={name} value={html} />
      {editorError ? <small className={styles.inlineError} role="alert">{editorError}</small> : null}
    </div>
  );
}
