export default async function SubmitVenueFormPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <h1>{locale === "en" ? "Submit a venue" : "Registrar un lugar"}</h1>
    </main>
  );
}
