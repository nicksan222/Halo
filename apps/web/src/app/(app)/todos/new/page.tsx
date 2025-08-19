'use client';

import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@acme/ui/components/card';
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
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components';
import { api } from '@/trpc/react';

interface NewTodoFormValues {
  title: string;
  description?: string;
}

export default function NewTodoPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const form = useForm<NewTodoFormValues>({
    defaultValues: { title: '', description: '' }
  });

  const mutation = api.todos.create.todo.useMutation({
    onSuccess: async () => {
      await utils.todos.list.all.invalidate();
      router.push('/todos');
    }
  });

  function onSubmit(values: NewTodoFormValues) {
    mutation.mutate({ title: values.title, description: values.description || undefined });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <PageHeader title="Create todo" backHref="/todos" />
      <Card>
        <CardHeader>
          <CardTitle>New Todo</CardTitle>
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
                      <Input placeholder="e.g. Ship MVP" {...field} />
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
                      <Textarea placeholder="Optional details" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <CardFooter className="px-0">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Create'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
