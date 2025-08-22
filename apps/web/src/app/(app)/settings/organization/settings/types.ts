import type { auth } from '@acme/auth';

export interface SettingsPageProps {
  organizationId: string;
  organization: typeof auth.$Infer.Organization;
}

export interface SettingsFormValues {
  name: string;
  slug: string;
}
