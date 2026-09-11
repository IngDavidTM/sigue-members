"use client";

import { useId, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { isAllowedImageUrl } from "@/lib/content/admin-validation";
import { MEDIA_ACCEPT, uploadContentImage } from "@/lib/content/media-upload";
import { useFormActivity } from "./FormActivity";
import styles from "./admin-components.module.css";

type Props = {
  name: string;
  label: string;
  initialValue?: string | null;
  onChange?: (url: string) => void;
};

export function MediaField({ name, label, initialValue = "", onChange }: Props) {
  const [url, setUrl] = useState(initialValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const id = useId();
  const activity = useFormActivity();
  const change = (next: string) => {
    setUrl(next);
    onChange?.(next);
    activity.markChanged();
    setError(next && !isAllowedImageUrl(next) ? "La URL debe ser pública y terminar en .avif o .webp." : "");
  };
  const upload = async (file: File) => {
    setError("");
    setUploading(true);
    activity.setUploading(id, true);
    try { change(await uploadContentImage(file)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo subir la imagen."); }
    finally { setUploading(false); activity.setUploading(id, false); }
  };
  return <div className={styles.mediaField}>
    <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
    {url && isAllowedImageUrl(url) ? <div className={styles.mediaPreview}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={url} src={url} alt="Vista previa" onError={() => setError("No se pudo cargar la imagen. Comprueba que la URL sea pública o vuelve a subirla.")} />
      <button type="button" disabled={activity.busy} onClick={() => change("")} aria-label="Quitar imagen"><X /></button>
    </div> : null}
    <label className={styles.uploadButton}>
      {uploading ? <LoaderCircle className={styles.spinner} /> : <ImagePlus />}
      {uploading ? "Preparando y subiendo…" : "Subir imagen"}
      <input type="file" accept={MEDIA_ACCEPT} disabled={activity.busy || uploading} onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) void upload(file);
      }} />
    </label>
    <input id={id} className={styles.urlInput} type="url" value={url} disabled={activity.busy || uploading}
      onChange={(event) => change(event.target.value.trim())} placeholder="O pega una URL pública .avif o .webp" />
    <input type="hidden" name={name} value={url} />
    <small>JPG, PNG, AVIF o WebP, hasta 8 MB. JPG y PNG se optimizan a WebP automáticamente.</small>
    {error ? <small className={styles.inlineError} role="alert">{error}</small> : null}
  </div>;
}
