export default async function OrganizerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <h1>{locale === "en" ? "Organizer dashboard" : "Panel de organizadores"}</h1>
    </main>
  );
}
