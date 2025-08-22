'use client';

import { authClient } from '@acme/auth/client';
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
import type { RemoveMemberProps } from './types';

export function RemoveMember({
  memberId,
  memberName,
  organizationId,
  onSuccess
}: RemoveMemberProps) {
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
        setError(error.message || 'Failed to remove member');
      } else {
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error removing member:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  }, [memberId, organizationId, onSuccess]);

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
          label="Remove Member"
          icon={<TrashIcon className="h-4 w-4" />}
          disabled={isRemoving}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{memberName}</strong> from the organization?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveMember}
            disabled={isRemoving}
            className="bg-red-700 text-white"
          >
            {isRemoving ? 'Removing...' : 'Remove Member'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
