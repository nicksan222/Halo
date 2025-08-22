'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import { useRouter } from 'next/navigation';
import { List } from '@/list';
import { MemberItem } from './member-item';
import type { MembersPageProps } from './types';

export function MembersClient({
  members,
  session: _session,
  currentUserMembership,
  organizationId
}: MembersPageProps) {
  const router = useRouter();

  const handleMemberRemoved = () => {
    // Refresh the page using Next.js router
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Members ({members.length})</CardTitle>
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
    </Card>
  );
}
