import { saveVenue } from "@/app/admin/actions/venues";
import { ActionForm } from "@/app/admin/components/ActionForm";
import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../content.module.css";

export const metadata = { title: "Sedes" };

export default async function AdminVenuesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: venues, error } = await supabase.from("event_venues").select("*").order("name");
  if (error) throw new Error(error.message);

  const fields = (venue?: (typeof venues)[number]) => <>
    <input type="hidden" name="id" value={venue?.id ?? ""} />
    <div className={styles.fields2}>
      <label className={styles.field}><span>Nombre *</span><input name="name" required defaultValue={venue?.name ?? ""} /></label>
      <label className={styles.field}><span>País</span><input name="country" defaultValue={venue?.country ?? "Colombia"} /></label>
      <label className={styles.field}><span>Dirección</span><input name="addressLine1" defaultValue={venue?.address_line_1 ?? ""} /></label>
      <label className={styles.field}><span>Complemento</span><input name="addressLine2" defaultValue={venue?.address_line_2 ?? ""} /></label>
      <label className={styles.field}><span>Ciudad</span><input name="city" defaultValue={venue?.city ?? ""} /></label>
      <label className={styles.field}><span>Región/departamento</span><input name="region" defaultValue={venue?.region ?? ""} /></label>
      <label className={styles.field}><span>Código postal</span><input name="postalCode" defaultValue={venue?.postal_code ?? ""} /></label>
      <label className={styles.field}><span>Enlace de mapa</span><input type="url" name="mapUrl" defaultValue={venue?.map_url ?? ""} /></label>
      <label className={styles.field}><span>Latitud</span><input type="number" step="any" name="latitude" defaultValue={venue?.latitude ?? ""} /></label>
      <label className={styles.field}><span>Longitud</span><input type="number" step="any" name="longitude" defaultValue={venue?.longitude ?? ""} /></label>
    </div>
  </>;

  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Ubicaciones</span><h1>Sedes</h1><p>Reutiliza direcciones completas en eventos presenciales e híbridos.</p></div></header>
    <div className={styles.mainColumn}>
      <ActionForm action={saveVenue} className={styles.card} submitLabel="Crear sede"><h2>Nueva sede</h2>{fields()}</ActionForm>
      {venues.map((venue) => <ActionForm key={venue.id} action={saveVenue} className={styles.card} submitLabel="Actualizar sede"><h2>{venue.name}</h2>{fields(venue)}</ActionForm>)}
    </div>
  </div>;
}
