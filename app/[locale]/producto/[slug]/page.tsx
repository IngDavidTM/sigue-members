interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main>
      <h1>Producto: {slug}</h1>
    </main>
  );
}
