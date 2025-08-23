'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Button } from '@acme/ui/components/button';
import List from '@acme/ui/components/list';
import { Popover, PopoverContent, PopoverTrigger } from '@acme/ui/components/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@acme/ui/components/select';
import { ShieldIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import type { ChangeMemberRoleProps, Role } from './types';

const ROLE_OPTIONS: Role[] = ['owner', 'admin', 'member'];

export function ChangeMemberRole({
  memberId,
  memberName,
  currentRole,
  organizationId,
  onSuccess
}: ChangeMemberRoleProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(currentRole);

  const options = useMemo(() => ROLE_OPTIONS, []);

  const onChangeRole = useCallback(async () => {
    if (!role || role === currentRole) {
      setIsOpen(false);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const { error } = await authClient.organization.updateMemberRole({
        memberId,
        organizationId,
        role
      });
      if (error) {
        setError(error.message || t.memberRole.failedToUpdate);
        return;
      }
      setIsOpen(false);
      onSuccess?.();
    } catch (_e) {
      setError(t.memberRole.unexpectedError);
    } finally {
      setIsSaving(false);
    }
  }, [
    role,
    currentRole,
    organizationId,
    memberId,
    onSuccess,
    t.memberRole.failedToUpdate,
    t.memberRole.unexpectedError
  ]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <List.Action label={t.memberRole.changeRole} icon={<ShieldIcon className="h-4 w-4" />} />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-3">
          <div className="text-sm font-medium">
            {t.memberRole.changeRoleFor} {memberName}
          </div>
          {error ? (
            <div className="p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          ) : null}
          <Select value={role} onValueChange={(val) => setRole(val as Role)}>
            <SelectTrigger>
              <SelectValue placeholder={t.memberRole.selectRole} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={onChangeRole} disabled={isSaving || role === currentRole}>
            {isSaving ? t.memberRole.saving : t.memberRole.saveRole}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
