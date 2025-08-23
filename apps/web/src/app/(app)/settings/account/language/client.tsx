'use client';

import type { SupportedLocale } from '@acme/localization';
import { translate } from '@acme/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@acme/ui/components/select';
import { useId, useMemo } from 'react';
import { useLocale, useSetLocale } from '@/localization/next';
import { lang } from './lang';

export function LanguageClient() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const t = translate(lang, locale);
  const languageSelectId = useId();

  const options = useMemo(
    () =>
      [
        { value: 'en', label: t.options.english },
        { value: 'it', label: t.options.italian }
      ] as const,
    [t.options.english, t.options.italian]
  );

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <label htmlFor={languageSelectId} className="block text-sm font-medium mb-2">
              {t.languageLabel}
            </label>
            <div id={languageSelectId}>
              <Select value={locale} onValueChange={(val) => setLocale(val as SupportedLocale)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
