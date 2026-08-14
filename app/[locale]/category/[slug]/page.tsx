interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main>
      <h1>Categoría: {slug}</h1>
    </main>
  );
}
