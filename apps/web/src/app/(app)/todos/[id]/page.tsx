'use client';

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
import { Textarea } from '@acme/ui/components/textarea';
import { Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components';
import { api } from '@/trpc/react';

interface EditTodoFormValues {
  title: string;
  description?: string | null;
  completed: boolean;
}

export default function TodoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

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

  if (query.isLoading) return <div>Loading…</div>;
  if (query.error)
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Failed to load todo</AlertTitle>
          <AlertDescription>{query.error.message}</AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/todos">Back</Link>
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
    <div className="max-w-2xl mx-auto space-y-4">
      <PageHeader title="Edit todo" backHref="/todos" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Details</CardTitle>
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
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                    <FormLabel>Description</FormLabel>
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
                      <FormLabel>Completed</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <CardFooter className="px-0">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
                <Button type="button" variant="secondary" asChild className="ml-2">
                  <Link href="/todos">Cancel</Link>
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
