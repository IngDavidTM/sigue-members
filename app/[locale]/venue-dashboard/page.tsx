export default async function VenueDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <h1>{locale === "en" ? "Venue dashboard" : "Panel de lugares"}</h1>
    </main>
  );
}
