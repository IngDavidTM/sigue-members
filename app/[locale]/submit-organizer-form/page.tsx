export default async function SubmitOrganizerFormPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <h1>{locale === "en" ? "Submit an organizer" : "Registrar un organizador"}</h1>
    </main>
  );
}
