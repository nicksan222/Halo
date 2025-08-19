'use client';

import { Alert, AlertDescription, AlertTitle } from '@acme/ui/components/alert';
import { Badge } from '@acme/ui/components/badge';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Checkbox } from '@acme/ui/components/checkbox';
import { Skeleton } from '@acme/ui/components/skeleton';
import Link from 'next/link';
import { api } from '@/trpc/react';

export function TodoList() {
  const query = api.todos.list.all.useQuery({});
  const data = (query.data ?? []) as NonNullable<typeof query.data>;

  if (query.isLoading)
    return (
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
    );

  if (query.error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load todos</AlertTitle>
        <AlertDescription>{query.error.message}</AlertDescription>
      </Alert>
    );

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">No todos yet</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <div className="flex items-center justify-between">
            <span>Get started by creating your first todo.</span>
            <Button asChild size="sm">
              <Link href="/todos/new">Create a todo</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
                {todo.completed ? 'Completed' : 'Pending'}
              </Badge>
              <Checkbox checked={todo.completed} disabled />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {todo.description ?? 'No description'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
