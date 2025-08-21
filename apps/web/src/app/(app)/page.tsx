import { translate } from '@acme/localization';
import { useLocale } from '@acme/localization/next-server';
import { cookies, headers } from 'next/headers';
import { PageHeader, TodoList } from '@/components';
import { lang } from './lang';

export default async function HomeTodosPage() {
  const headersList = await headers();
  const cookiesList = await cookies();

  const { locale } = useLocale(
    {
      headers: headersList,
      cookies: {
        get: (name) => cookiesList.get(name)?.value,
        set: (name, value) => cookiesList.set(name, value)
      }
    },
    { cookieName: 'locale', defaultLocale: 'en' }
  );
  const t = translate(lang, locale);
  return (
    <div className="space-y-6">
      <PageHeader
        title={t.home.title}
        description={t.home.description}
        action={{ href: '/todos/new', label: t.home.actionNew }}
        backLabel={t.common.back}
      />
      <TodoList />
    </div>
  );
}
