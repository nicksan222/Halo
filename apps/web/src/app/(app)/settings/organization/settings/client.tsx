'use client';

import { authClient } from '@acme/auth/client';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Input } from '@acme/ui/components/input';
import { Label } from '@acme/ui/components/label';
import { useState } from 'react';
import type { SettingsPageProps } from './types';

export function SettingsClient({ organizationId, organization }: SettingsPageProps) {
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
    if (error) setMessage(error.message || 'Failed to save changes');
    else setMessage('Saved');
    setIsSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={nameId}>Name</Label>
          <Input
            id={nameId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Inc."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={slugId}>Slug</Label>
          <Input
            id={slugId}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="acme"
          />
        </div>
        {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}
