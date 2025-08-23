'use client';

import { translate } from '@acme/localization';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { List } from '@/list';
import { useLocale } from '@/providers/i18n-provider';
import { InviteMember } from './invite-member';
import { lang } from './lang';
import { MemberItem } from './member-item';
import type { MembersPageProps } from './types';

export function MembersClient({
  members,
  session: _session,
  currentUserMembership,
  organizationId
}: MembersPageProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = translate(lang, locale);

  const handleMemberRemoved = () => {
    // Refresh the page using Next.js router
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t.title} ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <List.Container className="w-full">
          {members.length > 0 && <List.Item className="hidden" aria-hidden />}
          {members.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              currentUserMembership={currentUserMembership}
              allMembers={members}
              organizationId={organizationId}
              onMemberRemoved={handleMemberRemoved}
            />
          ))}
        </List.Container>
      </CardContent>
      <InviteMember
        organizationId={organizationId}
        onInvited={() => {
          toast.success(t.invitationSent);
        }}
      />
    </Card>
  );
}
