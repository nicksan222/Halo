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
import { Input } from '@acme/ui/components/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

export function SignUpOrgSelection({
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
    <Card className="z-50 w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t.orgSelectTitle}</CardTitle>
        <CardDescription>{t.orgSelectSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            {t.loadingOrganizations}
          </div>
        ) : organizations && organizations.length > 0 ? (
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
        ) : (
          <CreateFirstOrganization onCreated={onContinue} onGoBack={onGoBack} />
        )}
      </CardContent>
    </Card>
  );
}

function CreateFirstOrganization({
  onCreated,
  onGoBack
}: {
  onCreated: (orgId: string) => Promise<void>;
  onGoBack: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useLocale();
  const t = translate(lang, locale);
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Create your first organization
        </h3>
        <p className="text-sm text-muted-foreground">Get started by creating your organization</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="org-name-input" className="text-sm font-medium text-foreground">
            {t.organization}
          </label>
          <Input
            id={`org-name-input-${Math.random()}`}
            placeholder={t.organizationPlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-3">
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!name || isSubmitting}
            onClick={async () => {
              if (!name) return;
              setIsSubmitting(true);
              const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
              const res = await authClient.organization.create({ name, slug });
              const createdId = (res as any)?.organization?.id ?? (res as any)?.id;
              if (createdId) {
                await onCreated(createdId as string);
              } else {
                router.push('/');
              }
              setIsSubmitting(false);
            }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              t.continue
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onGoBack}
            className="w-full flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
}
