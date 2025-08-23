'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Input } from '@acme/ui/components/input';
import { Label } from '@acme/ui/components/label';
import { useState } from 'react';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import type { SettingsPageProps } from './types';

export function SettingsClient({ organizationId, organization }: SettingsPageProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const nameId = 'organization-name';
  const slugId = 'organization-slug';
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSave() {
    setIsSaving(true);
    setMessage(null);
    const { error } = await authClient.organization.update({
      data: {
        ...(name ? { name } : {}),
        ...(slug ? { slug } : {})
      },
      organizationId
    });
    if (error) setMessage(error.message || t.failedToSave);
    else setMessage(t.saved);
    setIsSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={nameId}>{t.name}</Label>
          <Input
            id={nameId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={slugId}>{t.slug}</Label>
          <Input
            id={slugId}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={t.slugPlaceholder}
          />
        </div>
        {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? t.saving : t.save}
        </Button>
      </CardFooter>
    </Card>
  );
}
