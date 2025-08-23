'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Input } from '@acme/ui/components/input';
import { Label } from '@acme/ui/components/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import type { DeletePageProps } from './types';

export function DeleteClient({ organizationId }: DeletePageProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = translate(lang, locale);
  const confirmId = 'confirm-delete';
  const [confirm, setConfirm] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onDelete() {
    setIsBusy(true);
    setMessage(null);
    const { error } = await authClient.organization.delete({
      organizationId
    });
    if (error) setMessage(error.message || t.failedToDelete);
    else router.push('/');
    setIsBusy(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-sm text-muted-foreground">{t.description}</div>
        <div className="grid gap-2">
          <Label htmlFor={confirmId}>{t.confirmation}</Label>
          <Input
            id={confirmId}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t.confirmationPlaceholder}
          />
        </div>
        {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={onDelete} disabled={isBusy || confirm !== 'DELETE'}>
          {isBusy ? t.deleting : t.delete}
        </Button>
      </CardFooter>
    </Card>
  );
}
