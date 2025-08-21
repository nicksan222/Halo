'use client';

import { translate } from '@acme/localization';
import { Badge } from '@acme/ui/components/badge';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Globe, Loader2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import { useSessionsStore } from './store';

export default function AccountSessionsPage() {
  const locale = useLocale();
  const t = translate(lang, locale);

  // Use Zustand store
  const {
    sessions,
    isLoading,
    revokingSessionId,
    error,
    loadSessions,
    revokeSession,
    revokeAllOtherSessions,
    clearError
  } = useSessionsStore();

  // Load sessions on mount
  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Handle successful operations
  const handleRevokeSession = async (sessionId: string) => {
    await revokeSession(sessionId);
    if (!useSessionsStore.getState().error) {
      toast.success(t.revokeSuccess);
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    await revokeAllOtherSessions();
    if (!useSessionsStore.getState().error) {
      toast.success(t.revokeAllSuccess);
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

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t.cardTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
              </p>
              {sessions.length > 1 && (
                <Button
                  variant="outline"
                  onClick={handleRevokeAllOtherSessions}
                  disabled={revokingSessionId !== null}
                >
                  {t.revokeAll}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.device)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.device}</p>
                        {session.isCurrent && (
                          <Badge variant="default" className="text-xs">
                            {t.currentSession}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {formatLastActive(session.lastActive)}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokingSessionId === session.id}
                    >
                      {revokingSessionId === session.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        t.revoke
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
