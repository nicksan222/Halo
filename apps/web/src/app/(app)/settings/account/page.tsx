import { redirect } from 'next/navigation';

export default function AccountSettingsIndex() {
  redirect('/settings/account/profile');
}
