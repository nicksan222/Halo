import { redirect } from 'next/navigation';

export default function OrganizationSettingsIndex() {
  redirect('/settings/organization/members');
}
