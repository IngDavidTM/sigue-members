interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductoPage({ params }: Props) {
  const { locale, slug } = await params;

  return (
    <main>
      <h1>{locale === "en" ? "Product" : "Producto"}: {slug}</h1>
    </main>
  );
}
