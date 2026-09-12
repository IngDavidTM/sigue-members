export default async function EventOrganizersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <h1>{locale === "en" ? "Event organizers" : "Organizadores de eventos"}</h1>
    </main>
  );
}
