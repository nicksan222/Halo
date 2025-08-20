'use client';

import { translate } from '@acme/localization';
import { Alert, AlertDescription, AlertTitle } from '@acme/ui/components/alert';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import Link from 'next/link';
import { useEffect } from 'react';
import { lang } from '@/app/(app)/lang';
import { useLocale } from '@/providers/i18n-provider';

export default function ErrorComponent({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const t = translate(lang, locale);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{t.error.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{t.error.error}</AlertTitle>
            <AlertDescription>{error.message || t.error.unexpectedError}</AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={() => reset()}>{t.error.tryAgain}</Button>
            <Button asChild variant="secondary">
              <Link href="/">{t.error.goHome}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
