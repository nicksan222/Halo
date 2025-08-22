'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import type { BillingPageProps } from './types';

export function BillingClient({ organizationId: _organizationId }: BillingPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">Billing settings coming soon.</div>
      </CardContent>
    </Card>
  );
}
