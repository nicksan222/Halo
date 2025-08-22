'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Avatar, AvatarFallback, AvatarImage } from '@acme/ui/components/avatar';
import { Badge } from '@acme/ui/components/badge';
import { Button } from '@acme/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@acme/ui/components/card';
import { useState } from 'react';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

export function SignInOrgSelection({
  onContinue,
  onGoBack
}: {
  onContinue: (orgId: string) => Promise<void>;
  onGoBack: () => void;
}) {
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const [selected, setSelected] = useState<string | null>(null);
  const locale = useLocale();
  const t = translate(lang, locale);

  if (!isPending && (organizations?.length ?? 0) === 1) {
    void onContinue(organizations![0]!.id);
    return (
      <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
        {t.loadingOrganizations}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t.orgSelectTitle}</CardTitle>
        <CardDescription>{t.orgSelectSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            {t.loadingOrganizations}
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-3">
              {(organizations ?? []).map((org) => {
                const isActive = selected === org.id;
                const plan = (org as any).metadata?.plan as string | undefined;
                const initials = org.name?.slice(0, 2)?.toUpperCase() ?? 'OR';
                return (
                  <Card
                    key={org.id}
                    className={
                      'group relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ' +
                      (isActive
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-border hover:border-primary/50 bg-card')
                    }
                    onClick={async () => {
                      setSelected(org.id);
                      await onContinue(org.id);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                            <AvatarImage src={(org as any).logo ?? ''} alt={org.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-foreground truncate">{org.name}</h3>
                            {plan && (
                              <Badge
                                variant={plan === 'Pro' ? 'default' : 'secondary'}
                                className="text-xs px-1.5 py-0"
                              >
                                {plan}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">@{org.slug}</p>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={
                              'rounded-full p-1 transition-colors bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary'
                            }
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={onGoBack}
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
