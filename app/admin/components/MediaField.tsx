"use client";

import { useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";

import {
  hasValidMediaSignature,
  isAllowedImageUrl,
  isAllowedMediaFile,
  MAX_MEDIA_BYTES,
} from "@/lib/content/admin-validation";

import styles from "./admin-components.module.css";

type Props = {
  name: string;
  label: string;
  initialValue?: string | null;
};

export function MediaField({ name, label, initialValue = "" }: Props) {
  const [url, setUrl] = useState(initialValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setError("");
    if (!isAllowedMediaFile(file)) {
      setError(`Solo se permiten imágenes .avif o .webp de hasta ${MAX_MEDIA_BYTES / 1024 / 1024} MB.`);
      return;
    }
    try {
      if (!(await hasValidMediaSignature(file))) {
        setError("El contenido del archivo no coincide con una imagen AVIF o WebP válida.");
        return;
      }
      setUploading(true);
      const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
      const payload = new FormData();
      payload.set("file", file, `${crypto.randomUUID()}.${extension}`);
      const response = await fetch("/api/admin/media", { method: "POST", body: payload });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        setError(result.error || "No se pudo subir la imagen.");
        return;
      }
      setUrl(result.url);
    } catch {
      setError("No se pudo leer o subir la imagen. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.mediaField}>
      <span className={styles.fieldLabel}>{label}</span>
      {url ? (
        <div className={styles.mediaPreview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Vista previa" />
          <button type="button" onClick={() => setUrl("")} aria-label="Quitar imagen"><X /></button>
        </div>
      ) : null}
      <label className={styles.uploadButton}>
        {uploading ? <LoaderCircle className={styles.spinner} /> : <ImagePlus />}
        {uploading ? "Subiendo…" : "Subir imagen"}
        <input
          type="file"
          accept=".avif,.webp,image/avif,image/webp"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </label>
      <input
        className={styles.urlInput}
        type="text"
        value={url}
        onChange={(event) => {
          const next = event.target.value.trim();
          setUrl(next);
          setError(next && !isAllowedImageUrl(next) ? "La URL debe ser pública y terminar en .avif o .webp." : "");
        }}
        placeholder="O pega una URL pública .avif o .webp"
      />
      <input type="hidden" name={name} value={url} />
      <small>Formatos permitidos: AVIF y WebP. Máximo 8 MB.</small>
      {error ? <small className={styles.inlineError}>{error}</small> : null}
    </div>
  );
}
