'use client';

export const dynamic = 'force-dynamic';

import { translate } from '@acme/localization';
import { Alert, AlertDescription, AlertTitle } from '@acme/ui/components/alert';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Checkbox } from '@acme/ui/components/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@acme/ui/components/form';
import { Input } from '@acme/ui/components/input';
import Shell from '@acme/ui/components/shell/client';
import { Textarea } from '@acme/ui/components/textarea';
import { Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale } from '@/providers/i18n-provider';
import { api } from '@/trpc/react';
import { lang } from './lang';

interface EditTodoFormValues {
  title: string;
  description?: string | null;
  completed: boolean;
}

export default function TodoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();
  const locale = useLocale();
  const t = translate(lang, locale);

  const query = api.todos.get.byId.useQuery({ id: params.id });
  const updateMutation = api.todos.update.todo.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.todos.get.byId.invalidate({ id: params.id }),
        utils.todos.list.all.invalidate()
      ]);
    }
  });
  const deleteMutation = api.todos.delete.todo.useMutation({
    onSuccess: async () => {
      await utils.todos.list.all.invalidate();
      router.push('/todos');
    }
  });

  const form = useForm<EditTodoFormValues>({
    defaultValues: {
      title: '',
      description: '',
      completed: false
    }
  });

  useEffect(() => {
    if (query.data) {
      form.reset({
        title: query.data.title,
        description: query.data.description ?? '',
        completed: query.data.completed
      });
    }
  }, [query.data, form]);

  if (query.isLoading) return <div>{t.loading}</div>;
  if (query.error)
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>{t.loadError}</AlertTitle>
          <AlertDescription>{query.error.message}</AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/todos">{t.back}</Link>
        </Button>
      </div>
    );

  function onSubmit(values: EditTodoFormValues) {
    updateMutation.mutate({
      id: params.id,
      title: values.title,
      description: values.description ?? undefined,
      completed: values.completed
    });
  }

  return (
    <>
      <Shell.Header>
        <Shell.Back href="/todos" />
        <Shell.Title>{t.title}</Shell.Title>
        <Shell.Action
          variant="destructive"
          text={deleteMutation.isPending ? undefined : undefined}
          onClick={() => deleteMutation.mutate({ id: params.id })}
        />
      </Shell.Header>
      <Shell.Content>
        <div className="grid gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.cardTitle}</CardTitle>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate({ id: params.id })}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: t.titleRequired }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.titleLabel}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.descriptionLabel}</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value ?? ''} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="completed"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>{t.completed}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <CardFooter className="px-0">
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        t.save
                      )}
                    </Button>
                    <Button type="button" variant="secondary" asChild className="ml-2">
                      <Link href="/todos">{t.cancel}</Link>
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Shell.Content>
    </>
  );
}
