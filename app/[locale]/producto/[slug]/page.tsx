import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ProductoPage({ params }: Props) {
  await params;
  // No hay fuente de datos pública para productos todavía.
  // Antes esta página devolvía 200 con contenido falso ("Producto: {slug}")
  // para cualquier slug. Hasta que exista una consulta real para productos, devolvemos 404 para todos los slugs.
  notFound();
}
