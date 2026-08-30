"use client";

import { useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

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
    if (!file.type.startsWith("image/")) {
      setError("Selecciona una imagen JPG, PNG, WebP o GIF.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("La imagen supera el máximo de 8 MB.");
      return;
    }

    setUploading(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `content/${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from("content-media")
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("content-media").getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
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
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </label>
      <input
        className={styles.urlInput}
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="O pega una URL pública"
      />
      <input type="hidden" name={name} value={url} />
      {error ? <small className={styles.inlineError}>{error}</small> : null}
    </div>
  );
}
