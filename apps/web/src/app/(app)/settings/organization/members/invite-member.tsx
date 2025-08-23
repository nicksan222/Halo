'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Button } from '@acme/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@acme/ui/components/dialog';
import { Input } from '@acme/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@acme/ui/components/select';
import Shell from '@acme/ui/components/shell';
import { PlusIcon } from 'lucide-react';
import { useCallback, useId, useMemo, useState } from 'react';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import type { InviteMemberProps, Role } from './types';

const ROLE_OPTIONS: Role[] = ['owner', 'admin', 'member'];

export function InviteMember({ organizationId, onInvited }: InviteMemberProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const [isOpen, setIsOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');
  const emailInputId = useId();
  const roleSelectId = useId();

  const options = useMemo(() => ROLE_OPTIONS, []);

  const resetForm = useCallback(() => {
    setEmail('');
    setRole('member');
    setError(null);
  }, []);

  const onInvite = useCallback(async () => {
    if (!email) return;
    setIsInviting(true);
    setError(null);
    try {
      const { error } = await authClient.organization.inviteMember({
        email,
        role,
        organizationId
      });
      if (error) {
        setError(error.message || t.inviteMember.failedToSend);
        return;
      }
      resetForm();
      setIsOpen(false);
      onInvited?.();
    } catch (_e) {
      setError(t.inviteMember.unexpectedError);
    } finally {
      setIsInviting(false);
    }
  }, [
    email,
    role,
    organizationId,
    onInvited,
    resetForm,
    t.inviteMember.failedToSend,
    t.inviteMember.unexpectedError
  ]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const isDisabled = isInviting || !email;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Shell.Action text={t.inviteMember.inviteMember} icon={<PlusIcon className="h-4 w-4" />} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.inviteMember.title}</DialogTitle>
          <DialogDescription>{t.inviteMember.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error ? (
            <div className="p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          ) : null}
          <div className="grid gap-2">
            <label htmlFor={emailInputId} className="text-sm font-medium">
              {t.inviteMember.email}
            </label>
            <Input
              id={emailInputId}
              type="email"
              placeholder={t.inviteMember.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor={roleSelectId} className="text-sm font-medium">
              {t.inviteMember.role}
            </label>
            <div id={roleSelectId}>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.inviteMember.selectRole} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onInvite} disabled={isDisabled}>
            {isInviting ? t.inviteMember.sending : t.inviteMember.sendInvite}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
