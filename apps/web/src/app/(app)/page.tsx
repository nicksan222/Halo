'use client';

import { translate } from '@acme/localization';
import { PageHeader, TodoList } from '@/components';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

export const dynamic = 'force-dynamic';

export default function HomeTodosPage() {
  const locale = useLocale();
  const t = translate(lang, locale);
  return (
    <div className="space-y-6">
      <PageHeader
        title={t.home.title}
        description={t.home.description}
        action={{ href: '/todos/new', label: t.home.actionNew }}
      />
      <TodoList />
    </div>
  );
}
