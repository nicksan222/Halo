'use client';

import { translate } from '@acme/localization';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useLocale } from '@/localization/next';
import Shell from '@/shell';
import { lang } from './lang';

export default function AccountSettingsLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const pathname = usePathname();

  const base = '/settings/account';
  const isProfile = pathname === `${base}` || pathname?.startsWith(`${base}/profile`);
  const isSecurity = pathname?.startsWith(`${base}/security`);

  const isSessions = pathname?.startsWith(`${base}/sessions`);
  const isVerification = pathname?.startsWith(`${base}/verification`);
  const isDanger = pathname?.startsWith(`${base}/danger`);
  const isLanguage = pathname?.startsWith(`${base}/language`);

  return (
    <Shell>
      <Shell.Header>
        <Shell.Back href="/" />
        <Shell.Title>{t.title}</Shell.Title>
        <Shell.Description>{t.description}</Shell.Description>
      </Shell.Header>
      <Shell.TabContainer position="side">
        <Shell.Tab
          title={t.tabs.profile}
          description={t.tabs.profileDescription}
          href="/settings/account/profile"
          isActive={Boolean(isProfile)}
        />
        <Shell.Tab
          title={t.tabs.security}
          description={t.tabs.securityDescription}
          href="/settings/account/security"
          isActive={Boolean(isSecurity)}
        />
        <Shell.Tab
          title={t.tabs.language}
          description={t.tabs.languageDescription}
          href="/settings/account/language"
          isActive={Boolean(isLanguage)}
        />

        <Shell.Tab
          title={t.tabs.sessions}
          description={t.tabs.sessionsDescription}
          href="/settings/account/sessions"
          isActive={Boolean(isSessions)}
        />
        <Shell.Tab
          title={t.tabs.verification}
          description={t.tabs.verificationDescription}
          href="/settings/account/verification"
          isActive={Boolean(isVerification)}
        />
        <Shell.Tab
          title={t.tabs.danger}
          description={t.tabs.dangerDescription}
          href="/settings/account/danger"
          isActive={Boolean(isDanger)}
        />
      </Shell.TabContainer>
      <Shell.Content>{children}</Shell.Content>
    </Shell>
  );
}
