'use client';

export const dynamic = 'force-dynamic';

import { translate } from '@acme/localization';
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
import Shell from '@acme/ui/components/shell/client';
import { Textarea } from '@acme/ui/components/textarea';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useLocale } from '@/providers/i18n-provider';
import { api } from '@/trpc/react';
import { lang } from './lang';

interface NewTodoFormValues {
  title: string;
  description?: string;
}

export default function NewTodoPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const locale = useLocale();
  const t = translate(lang, locale);

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
    <>
      <Shell.Header>
        <Shell.Back href="/todos" />
        <Shell.Title>{t.title}</Shell.Title>
      </Shell.Header>
      <Shell.Content>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.cardTitle}</CardTitle>
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
                          <Input placeholder={t.titlePlaceholder} {...field} />
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
                          <Textarea placeholder={t.descriptionPlaceholder} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <CardFooter className="px-0">
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        t.create
                      )}
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
