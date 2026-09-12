export default async function EventVenuesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <h1>{locale === "en" ? "Event venues" : "Lugares de eventos"}</h1>
    </main>
  );
}
