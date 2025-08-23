'use client';

import { useEffect } from 'react';
import { useLocale } from '@/localization/next';

export function HtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
