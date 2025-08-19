'use client';

import { Alert, AlertDescription, AlertTitle } from '@acme/ui/components/alert';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorComponent({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message || 'An unexpected error occurred.'}</AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={() => reset()}>Try again</Button>
            <Button asChild variant="secondary">
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
