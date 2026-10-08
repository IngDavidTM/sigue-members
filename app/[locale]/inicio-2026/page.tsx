import { redirect } from 'next/navigation';

export default async function RetiredHomePreview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  redirect(requestedLocale === 'en' ? '/en' : '/es');
}
