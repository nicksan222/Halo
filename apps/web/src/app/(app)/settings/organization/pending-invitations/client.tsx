'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import List from '@acme/ui/components/list';
import { Loader2, Mail, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import type { PendingInvitationsPageProps } from './types';

export function PendingInvitationsClient({
  organizationId,
  invitations
}: PendingInvitationsPageProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleResend = async (email: string, role?: string) => {
    setResendingEmail(email);
    try {
      const result = await authClient.organization.inviteMember({
        email,
        organizationId,
        resend: true,
        role: (role as any) || 'member'
      });

      if ('error' in result && result.error) {
        throw new Error(result.error.message || t.resendError);
      }

      toast.success(t.resendSuccess);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.resendError);
    } finally {
      setResendingEmail(null);
    }
  };

  const handleCancel = async (invitationId: string) => {
    setCancellingId(invitationId);
    try {
      const result = await authClient.organization.cancelInvitation({ invitationId });

      if ('error' in result && result.error) {
        throw new Error(result.error.message || t.cancelError);
      }

      toast.success(t.cancelSuccess);
      // Refresh the page to get updated invitations
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.cancelError);
    } finally {
      setCancellingId(null);
    }
  };

  // Calculate when the invitation was sent based on expiration date
  // Assuming invitations expire after 7 days
  const getInvitationSentDate = (expiresAt: string | Date) => {
    const expirationDate = new Date(expiresAt);
    const sentDate = new Date(expirationDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before expiration
    return sentDate;
  };

  const formatSentDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return t.justNow;
    if (diffInHours < 24) return `${diffInHours} ${t.hoursAgo}`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return `1 ${t.dayAgo}`;
    return `${diffInDays} ${t.daysAgo}`;
  };

  const formatInvitationSentDate = (expiresAt: string | Date) => {
    const sentDate = getInvitationSentDate(expiresAt);
    return formatSentDate(sentDate);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t.cardTitle} ({invitations.length} invitation{invitations.length !== 1 ? 's' : ''})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t.noInvitations}</div>
          ) : (
            <List.Container hideFilter>
              {invitations.map((invitation) => (
                <List.Item key={invitation.id}>
                  <List.Icon>
                    <Mail className="h-4 w-4" />
                  </List.Icon>
                  <List.Title>{invitation.email}</List.Title>
                  <List.Description>
                    {t.role}: {invitation.role || 'member'}
                  </List.Description>
                  <List.Badge variant="secondary" className="text-xs">
                    {t.sent} {formatInvitationSentDate(invitation.expiresAt)}
                  </List.Badge>
                  <List.Actions>
                    <List.Action
                      icon={
                        resendingEmail === invitation.email ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )
                      }
                      label={t.resend}
                      onClick={() => handleResend(invitation.email, invitation.role)}
                      disabled={resendingEmail === invitation.email}
                    />
                    <List.Action
                      icon={
                        cancellingId === invitation.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )
                      }
                      label={t.cancel}
                      onClick={() => handleCancel(invitation.id)}
                      disabled={cancellingId === invitation.id}
                    />
                  </List.Actions>
                </List.Item>
              ))}
            </List.Container>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
