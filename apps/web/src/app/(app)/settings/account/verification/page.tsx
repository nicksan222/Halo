'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Badge } from '@acme/ui/components/badge';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import { CheckCircle, Loader2, Mail, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

export default function AccountVerificationPage() {
  const locale = useLocale();
  const t = translate(lang, locale);
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isEmailVerified = session?.user?.emailVerified;

  async function resendEmailVerification() {
    setIsLoading(true);
    try {
      await authClient.sendVerificationEmail({
        email: session?.user?.email || '',
        callbackURL: '/settings/account/verification'
      });
      toast.success(t.success);
    } catch (_error) {
      toast.error(t.genericError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      {/* Email Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t.emailVerification}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isEmailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{session?.user?.email}</p>
                  <Badge variant={isEmailVerified ? 'default' : 'secondary'} className="mt-1">
                    {isEmailVerified ? t.emailVerified : t.emailUnverified}
                  </Badge>
                </div>
              </div>
              {!isEmailVerified && (
                <Button onClick={resendEmailVerification} disabled={isLoading}>
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : t.resendEmail}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
