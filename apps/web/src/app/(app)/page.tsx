'use client';

import { translate } from '@acme/localization';
import { Alert, AlertDescription, AlertTitle } from '@acme/ui/components/alert';
import { Badge } from '@acme/ui/components/badge';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Checkbox } from '@acme/ui/components/checkbox';
import Shell from '@acme/ui/components/shell';
import { Skeleton } from '@acme/ui/components/skeleton';
import Link from 'next/link';
import { useLocale } from '@/providers/i18n-provider';
import { api } from '@/trpc/react';
import { lang } from './lang';

export default function HomeTodosPage() {
  const locale = useLocale();
  const t = translate(lang, locale);
  const query = api.todos.list.all.useQuery({});
  const data = (query.data ?? []) as NonNullable<typeof query.data>;

  if (query.isLoading)
    return (
      <>
        <Shell.Header>
          <Shell.Title>{t.home.title}</Shell.Title>
          <Shell.Description>{t.home.description}</Shell.Description>
          <Shell.Action text={t.home.actionNew} href="/todos/new" />
        </Shell.Header>
        <Shell.Content>
          <div className="grid gap-4">
            {[0, 1, 2].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-5 w-24 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Shell.Content>
      </>
    );

  if (query.error)
    return (
      <>
        <Shell.Header>
          <Shell.Title>{t.home.title}</Shell.Title>
          <Shell.Description>{t.home.description}</Shell.Description>
          <Shell.Action text={t.home.actionNew} href="/todos/new" />
        </Shell.Header>
        <Shell.Content>
          <Alert variant="destructive">
            <AlertTitle>{t.todos.failedToLoad}</AlertTitle>
            <AlertDescription>{query.error.message}</AlertDescription>
          </Alert>
        </Shell.Content>
      </>
    );

  if (!data.length) {
    return (
      <>
        <Shell.Header>
          <Shell.Title>{t.home.title}</Shell.Title>
          <Shell.Description>{t.home.description}</Shell.Description>
          <Shell.Action text={t.home.actionNew} href="/todos/new" />
        </Shell.Header>
        <Shell.Content>
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">{t.todos.noTodosYet}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <div className="flex items-center justify-between">
                <span>{t.todos.getStarted}</span>
                <Button asChild size="sm">
                  <Link href="/todos/new">{t.todos.createTodo}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Shell.Content>
      </>
    );
  }

  return (
    <>
      <Shell.Header>
        <Shell.Title>{t.home.title}</Shell.Title>
        <Shell.Description>{t.home.description}</Shell.Description>
        <Shell.Action text={t.home.actionNew} href="/todos/new" />
      </Shell.Header>
      <Shell.Content>
        <div className="grid gap-4">
          {data.map((todo: (typeof data)[number]) => (
            <Card key={todo.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-lg leading-tight">
                  <Link href={`/todos/${todo.id}`} className="hover:underline">
                    {todo.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant={todo.completed ? 'default' : 'secondary'}>
                    {todo.completed ? t.todos.completed : t.todos.pending}
                  </Badge>
                  <Checkbox checked={todo.completed} disabled />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {todo.description ?? t.todos.noDescription}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Shell.Content>
    </>
  );
}
