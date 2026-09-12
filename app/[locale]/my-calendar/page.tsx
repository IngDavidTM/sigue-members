export default async function MyCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <h1>{locale === "en" ? "My calendar" : "Mi calendario"}</h1>
    </main>
  );
}
