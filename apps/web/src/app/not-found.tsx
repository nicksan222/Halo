'use client';

import { translate } from '@acme/localization';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

export default function NotFound() {
  const locale = useLocale();
  const t = translate(lang, locale);

  return (
    <div className="min-h-[60vh] grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.notFound.title}</h1>
        <p className="text-muted-foreground mt-2">{t.notFound.description}</p>
      </div>
    </div>
  );
}
