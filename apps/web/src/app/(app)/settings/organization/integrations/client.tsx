'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import type { IntegrationsPageProps } from './types';

export function IntegrationsClient({ organizationId: _organizationId }: IntegrationsPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">Integrations coming soon.</div>
      </CardContent>
    </Card>
  );
}
