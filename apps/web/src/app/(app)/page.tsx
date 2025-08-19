'use client';

import { PageHeader, TodoList } from '@/components';

export default function HomeTodosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Todos"
        description="Stay on top of your tasks."
        action={{ href: '/todos/new', label: 'New' }}
      />
      <TodoList />
    </div>
  );
}
