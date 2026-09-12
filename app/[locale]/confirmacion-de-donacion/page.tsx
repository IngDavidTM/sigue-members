export default async function ConfirmacionDeDonacionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <h1>{locale === "en" ? "Donation confirmation" : "Confirmación de donación"}</h1>
    </main>
  );
}
