import DynamicFormEditor from "@/app/admin/components/DynamicFormEditor";
import { requireAdmin } from "@/lib/auth/authorization";

import styles from "../../content.module.css";

export const metadata = { title: "Nuevo formulario" };
export default async function NewDynamicFormPage() {
  await requireAdmin();
  return <div className={styles.page}><header className={styles.pageHeader}><div><span className={styles.eyebrow}>Formularios</span><h1>Nuevo formulario</h1><p>Define el contenido y agrega las preguntas que necesites.</p></div></header><DynamicFormEditor /></div>;
}
