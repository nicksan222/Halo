'use client';

import { authClient } from '@acme/auth/client';
import { Button } from '@acme/ui/components/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
  appName?: string;
  newLabel?: string;
  signOutLabel?: string;
}

export function AppHeader({
  appName = 'Halo Todos',
  newLabel = 'New',
  signOutLabel = 'Sign out'
}: AppHeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    try {
      await authClient.signOut();
      router.push('/auth/sign-in');
    } catch (_err) {
      router.push('/auth/sign-in');
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="font-semibold tracking-tight">{appName}</div>
      <div className="flex items-center gap-2 ml-auto">
        <Button asChild>
          <Link href="/todos/new">{newLabel}</Link>
        </Button>
        <Button variant="ghost" onClick={handleSignOut}>
          {signOutLabel}
        </Button>
      </div>
    </div>
  );
}
