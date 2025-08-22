'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import List from '@acme/ui/components/list';
import { Loader2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import type { SessionsPageProps } from './types';

export function SessionsClient({ user: _user, sessions }: SessionsPageProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [_isRevokingAll, setIsRevokingAll] = useState(false);

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingSessionId(sessionId);
    try {
      const result = await authClient.revokeSession({ token: sessionId });
      if ('error' in result && result.error) {
        throw new Error(result.error.message || 'Failed to revoke session');
      }
      toast.success(t.revokeSuccess);
      // Refresh the page to get updated sessions
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke session');
    } finally {
      setRevokingSessionId(null);
    }
  };

  const _handleRevokeAllOtherSessions = async () => {
    setIsRevokingAll(true);
    try {
      const result = await authClient.revokeOtherSessions();
      if ('error' in result && result.error) {
        throw new Error(result.error.message || 'Failed to revoke sessions');
      }
      toast.success(t.revokeAllSuccess);
      // Refresh the page to get updated sessions
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke sessions');
    } finally {
      setIsRevokingAll(false);
    }
  };

  function getDeviceIcon(device: string) {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (device.toLowerCase().includes('ipad') || device.toLowerCase().includes('tablet')) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  }

  function formatLastActive(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t.cardTitle} ({sessions.length} active session{sessions.length !== 1 ? 's' : ''})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <List.Container hideFilter>
            {sessions.map((session) => (
              <List.Item key={session.id}>
                <List.Icon>{getDeviceIcon(session.device)}</List.Icon>
                <List.Title>{session.device}</List.Title>
                <List.Description>
                  {session.location} • {formatLastActive(session.lastActive)}
                </List.Description>
                {session.isCurrent && (
                  <List.Badge variant="default" className="text-xs">
                    {t.currentSession}
                  </List.Badge>
                )}
                {!session.isCurrent && (
                  <List.Actions>
                    <List.Action
                      icon={
                        revokingSessionId === session.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="text-xs">{t.revoke}</span>
                        )
                      }
                      label={t.revoke}
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokingSessionId === session.id}
                    />
                  </List.Actions>
                )}
              </List.Item>
            ))}
          </List.Container>
        </CardContent>
      </Card>
    </div>
  );
}
