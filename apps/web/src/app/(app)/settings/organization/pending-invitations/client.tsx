'use client';

import { authClient } from '@acme/auth/client';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { PendingInvitationsPageProps } from './types';

export function PendingInvitationsClient({
  organizationId,
  invitations
}: PendingInvitationsPageProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const queryClient = useQueryClient();
  const invitationsQueryKey = ['organization', organizationId, 'invitations'];

  const invalidateInvitations = () =>
    queryClient.invalidateQueries({ queryKey: invitationsQueryKey });

  const resendMutation = useMutation({
    mutationFn: async (vars: { email: string; role: string }) =>
      authClient.organization.inviteMember({
        email: vars.email,
        organizationId,
        resend: true,
        role: (vars.role as any) || 'member'
      }),
    onSuccess: ({ error }) => {
      if (error) setMessage(error.message || 'Failed to resend');
      else setMessage('Invitation resent');
    }
  });
  async function onResend(_invitationId: string, email: string, role?: string) {
    setIsBusy(true);
    setMessage(null);
    await resendMutation.mutateAsync({ email, role: role || 'member' });
    setIsBusy(false);
  }

  const cancelMutation = useMutation({
    mutationFn: async (invitationId: string) =>
      authClient.organization.cancelInvitation({ invitationId }),
    onSuccess: async ({ error }) => {
      if (error) setMessage(error.message || 'Failed to cancel');
      else {
        setMessage('Invitation cancelled');
        await invalidateInvitations();
      }
    }
  });
  async function onCancel(invitationId: string) {
    setIsBusy(true);
    setMessage(null);
    await cancelMutation.mutateAsync(invitationId);
    setIsBusy(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {invitations.length === 0 ? (
          <div className="text-sm text-muted-foreground">No pending invitations</div>
        ) : (
          <div className="grid gap-2">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between gap-2 text-sm">
                <div className="truncate">
                  <div className="font-medium">{invitation.email}</div>
                  <div className="text-muted-foreground text-xs">{invitation.role || 'member'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onResend(invitation.id, invitation.email, invitation.role)}
                    disabled={isBusy}
                  >
                    Resend
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCancel(invitation.id)}
                    disabled={isBusy}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
      </CardContent>
    </Card>
  );
}
