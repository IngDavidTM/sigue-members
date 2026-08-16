import { NextResponse } from 'next/server';

const FALLBACK_COP_PER_USD = 3000;

export const revalidate = 3600;

type ProviderResponse = {
  result?: string;
  time_last_update_utc?: string;
  rates?: { COP?: number };
};

export async function GET() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate },
    });
    const data = (await response.json()) as ProviderResponse;
    const copPerUsd = data.rates?.COP;

    if (!response.ok || data.result !== 'success' || !Number.isFinite(copPerUsd) || !copPerUsd || copPerUsd <= 0) {
      throw new Error('Invalid exchange rate response');
    }

    return NextResponse.json(
      { copPerUsd, updatedAt: data.time_last_update_utc, fallback: false },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch {
    return NextResponse.json(
      { copPerUsd: FALLBACK_COP_PER_USD, fallback: true },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } }
    );
  }
}
