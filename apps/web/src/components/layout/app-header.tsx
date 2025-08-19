'use client';

import { authClient } from '@acme/auth/client';
import { Button } from '@acme/ui/components/button';
import Link from 'next/link';

export function AppHeader() {
  async function handleSignOut() {
    try {
      await authClient.signOut();
      window.location.href = '/auth/sign-in';
    } catch (err) {
      window.location.href = '/auth/sign-in';
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="font-semibold tracking-tight">Halo Todos</div>
      <div className="flex items-center gap-2 ml-auto">
        <Button asChild>
          <Link href="/todos/new">New</Link>
        </Button>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
