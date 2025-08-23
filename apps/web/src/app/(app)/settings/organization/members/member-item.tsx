'use client';

import { translate } from '@acme/localization';
import { ShieldIcon, UserIcon } from 'lucide-react';
import { memo } from 'react';
import { List } from '@/list';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import { ChangeMemberRole } from './member-role';
import { RemoveMember } from './remove-member';
import type { MemberItemProps } from './types';

export const MemberItem = memo(function MemberItem({
  member,
  currentUserMembership,
  organizationId,
  onMemberRemoved
}: MemberItemProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const name = member.user.name || t.memberItem.unknownUser;
  const email = member.user.email;
  const image = member.user.image || undefined;

  const isCurrentUser = member.userId === currentUserMembership.userId;

  return (
    <List.Item key={member.id}>
      <List.Avatar firstName={member.user.name} src={image} alt={name} />
      <List.Title className="flex items-center gap-2">{name}</List.Title>
      {email && <List.Description>{email}</List.Description>}
      <List.Badges>
        {isCurrentUser && (
          <List.Badge
            variant="default"
            text={t.memberItem.you}
            icon={<UserIcon className="h-3 w-3" />}
          />
        )}
        <List.Badge
          variant="info"
          text={member.role.toLocaleLowerCase()}
          icon={<ShieldIcon className="h-3 w-3" />}
        />
      </List.Badges>

      <List.Actions>
        {(currentUserMembership.role === 'owner' || currentUserMembership.role === 'admin') && (
          <ChangeMemberRole
            memberId={member.id}
            memberName={name}
            currentRole={member.role}
            organizationId={organizationId}
            onSuccess={onMemberRemoved}
          />
        )}
        {((currentUserMembership.role === 'owner' && member.role !== 'owner') ||
          (currentUserMembership.role === 'admin' && member.role !== 'owner')) &&
          member.userId !== currentUserMembership.userId && (
            <RemoveMember
              memberId={member.id}
              memberName={name}
              organizationId={organizationId}
              onSuccess={onMemberRemoved}
            />
          )}
      </List.Actions>
    </List.Item>
  );
});
