'use client';

import { useEffect, useSyncExternalStore } from 'react';

type LocalePaths = { es?: string; en?: string };

// Pages whose slug differs per language (posts, events, categories, tags)
// publish their translated paths here so the header language switch can link
// straight to the translation instead of to a URL that redirects.
let currentPaths: LocalePaths | null = null;
const listeners = new Set<() => void>();

function publish(paths: LocalePaths | null) {
  currentPaths = paths;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useLocaleAlternatePaths() {
  return useSyncExternalStore(subscribe, () => currentPaths, () => null);
}

export default function LocaleAlternates({ es, en }: LocalePaths) {
  useEffect(() => {
    publish({ es, en });
    return () => publish(null);
  }, [es, en]);

  return null;
}
