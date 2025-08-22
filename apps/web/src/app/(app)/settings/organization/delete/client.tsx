'use client';

import { authClient } from '@acme/auth/client';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Input } from '@acme/ui/components/input';
import { Label } from '@acme/ui/components/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { DeletePageProps } from './types';

export function DeleteClient({ organizationId }: DeletePageProps) {
  const router = useRouter();
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
    if (error) setMessage(error.message || 'Failed to delete organization');
    else router.push('/');
    setIsBusy(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Organization</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-sm text-muted-foreground">
          This action cannot be undone. Type DELETE to confirm.
        </div>
        <div className="grid gap-2">
          <Label htmlFor={confirmId}>Confirmation</Label>
          <Input
            id={confirmId}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="DELETE"
          />
        </div>
        {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={onDelete} disabled={isBusy || confirm !== 'DELETE'}>
          {isBusy ? 'Deleting...' : 'Delete Organization'}
        </Button>
      </CardFooter>
    </Card>
  );
}
