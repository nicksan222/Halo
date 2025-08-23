'use client';

import { translate } from '@acme/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import type { BillingPageProps } from './types';

export function BillingClient({ organizationId: _organizationId }: BillingPageProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">{t.comingSoon}</div>
      </CardContent>
    </Card>
  );
}
