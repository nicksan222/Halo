'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@acme/ui/components/alert-dialog';
import List from '@acme/ui/components/list';
import { TrashIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';
import type { RemoveMemberProps } from './types';

export function RemoveMember({
  memberId,
  memberName,
  organizationId,
  onSuccess
}: RemoveMemberProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveMember = useCallback(async () => {
    setIsRemoving(true);
    setError(null);

    try {
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
        organizationId
      });

      if (error) {
        setError(error.message || t.removeMember.failedToRemove);
      } else {
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error removing member:', err);
      setError(t.removeMember.unexpectedError);
    } finally {
      setIsRemoving(false);
    }
  }, [
    memberId,
    organizationId,
    onSuccess,
    t.removeMember.failedToRemove,
    t.removeMember.unexpectedError
  ]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
    }
  }, []);

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <List.Action
          label={t.removeMember.removeMember}
          icon={<TrashIcon className="h-4 w-4" />}
          disabled={isRemoving}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.removeMember.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.removeMember.description} <strong>{memberName}</strong>{' '}
            {t.removeMember.descriptionEnd}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>{t.removeMember.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveMember}
            disabled={isRemoving}
            className="bg-red-700 text-white"
          >
            {isRemoving ? t.removeMember.removing : t.removeMember.remove}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
