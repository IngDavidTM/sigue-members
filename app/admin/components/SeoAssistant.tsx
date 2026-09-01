"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./admin-components.module.css";

type Props = { suffix: "Es" | "En" };

type Analysis = {
  title: string;
  description: string;
  phrase: string;
  phraseInTitle: boolean;
  phraseInDescription: boolean;
  phraseInContent: boolean;
};

const empty: Analysis = { title: "", description: "", phrase: "", phraseInTitle: false, phraseInDescription: false, phraseInContent: false };

export function SeoAssistant({ suffix }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [analysis, setAnalysis] = useState(empty);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const value = (name: string) => {
      const field = form.elements.namedItem(name);
      return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field.value.trim() : "";
    };
    const update = () => {
      const title = value(`seoTitle${suffix}`) || value(`title${suffix}`);
      const description = value(`seoDescription${suffix}`) || value(`excerpt${suffix}`);
      const phrase = value(`focusKeyphrase${suffix}`).toLocaleLowerCase();
      const content = value(`content${suffix}`).replace(/<[^>]+>/g, " ").toLocaleLowerCase();
      setAnalysis({
        title,
        description,
        phrase,
        phraseInTitle: Boolean(phrase && title.toLocaleLowerCase().includes(phrase)),
        phraseInDescription: Boolean(phrase && description.toLocaleLowerCase().includes(phrase)),
        phraseInContent: Boolean(phrase && content.includes(phrase)),
      });
    };
    update();
    form.addEventListener("input", update);
    window.addEventListener("admin-content-change", update);
    return () => {
      form.removeEventListener("input", update);
      window.removeEventListener("admin-content-change", update);
    };
  }, [suffix]);

  return <div className={styles.seoAssistant} ref={rootRef}>
    <strong>Vista previa y comprobación SEO</strong>
    <div className={styles.searchPreview}><span>{analysis.title || "Título de la página"}</span><p>{analysis.description || "Agrega una descripción para explicar esta página en los resultados de búsqueda."}</p></div>
    <ul>
      <li data-ok={analysis.title.length > 0 && analysis.title.length <= 60}>Título: {analysis.title.length}/60</li>
      <li data-ok={analysis.description.length > 0 && analysis.description.length <= 160}>Descripción: {analysis.description.length}/160</li>
      {analysis.phrase ? <>
        <li data-ok={analysis.phraseInTitle}>La frase clave aparece en el título</li>
        <li data-ok={analysis.phraseInDescription}>La frase clave aparece en la descripción</li>
        <li data-ok={analysis.phraseInContent}>La frase clave aparece en el contenido</li>
      </> : <li data-ok="false">Agrega una frase clave para analizar el contenido</li>}
    </ul>
  </div>;
}
