import { deleteEventRecording, saveEventRecording } from "@/app/(system)/admin/actions/recordings";
import { formatMaterials, hasEnded, SIGUE_AXES } from "@/lib/members/recordings";
import type { EventRecordingRow } from "@/types/supabase";

import contentStyles from "../content.module.css";
import { ActionForm } from "./ActionForm";
import { RichTextEditor } from "./RichTextEditor";

type Props = {
  eventId: string;
  endsAt: string;
  recording: EventRecordingRow | null;
  available: boolean;
  notice?: "saved" | "deleted";
};

export function RecordingForm({ eventId, endsAt, recording, available, notice }: Props) {
  const ended = hasEnded(endsAt);
  return <section id="grabacion" className={contentStyles.card} style={{ marginTop: 20 }}>
    <h2>Grabación para miembros</h2>
    <p>
      Los miembros con sesión iniciada verán el video, el resumen y los materiales en su panel (Webinars).
      La página pública del evento solo muestra que hay una grabación disponible para miembros; el enlace nunca se publica.
    </p>
    {!available ? <p className={contentStyles.saved} role="status">Falta aplicar la migración de grabaciones en Supabase. Se aplica sola al publicar en main.</p> : null}
    {notice === "saved" ? <p className={contentStyles.saved} role="status">Grabación guardada.</p> : null}
    {notice === "deleted" ? <p className={contentStyles.saved} role="status">Grabación eliminada.</p> : null}
    {!ended ? <p>Este evento aún no termina. Puedes preparar la grabación; los miembros la verán cuando el evento haya terminado y esté publicada.</p> : null}
    {available ? <ActionForm action={saveEventRecording} className={contentStyles.fields} submitLabel={recording ? "Actualizar grabación" : "Guardar grabación"}>
      <input type="hidden" name="eventId" value={eventId} />
      <div className={contentStyles.fields2}>
        <label className={contentStyles.field}>
          <span>Enlace de la grabación *</span>
          <input type="url" name="videoUrl" required placeholder="https://www.youtube.com/watch?v=…" defaultValue={recording?.video_url ?? ""} />
          <small>YouTube y Vimeo se reproducen dentro del panel; Zoom u otros se abren en una pestaña nueva. En YouTube usa «No listado».</small>
        </label>
        <label className={contentStyles.field}>
          <span>Eje SIGUE</span>
          <select name="sigueAxis" defaultValue={recording?.sigue_axis ?? ""}>
            <option value="">Sin eje</option>
            {SIGUE_AXES.map((axis) => <option key={axis.id} value={axis.id}>{axis.letter} · {axis.es}</option>)}
          </select>
        </label>
      </div>
      <RichTextEditor name="summaryEs" label="Resumen en español: qué se trató e ideas clave" initialContent={recording?.summary_es_html} placeholder="Temas, conclusiones y próximos pasos…" />
      <RichTextEditor name="summaryEn" label="Summary in English" initialContent={recording?.summary_en_html} placeholder="Topics, key takeaways and next steps…" />
      <label className={contentStyles.field}>
        <span>Materiales (uno por línea)</span>
        <textarea name="materials" defaultValue={formatMaterials(recording?.materials)} placeholder={"Presentación | https://…\nPlantilla de presupuesto | https://…"} />
        <small>Formato: Nombre | https://enlace</small>
      </label>
      <label className={contentStyles.checkbox}>
        <input type="checkbox" name="isPublished" defaultChecked={recording?.is_published ?? true} /> Visible para los miembros
      </label>
    </ActionForm> : null}
    {available && recording ? <form action={deleteEventRecording} style={{ marginTop: 14 }}>
      <input type="hidden" name="eventId" value={eventId} />
      <button className={contentStyles.dangerButton} type="submit">Eliminar grabación</button>
    </form> : null}
  </section>;
}
