'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@acme/ui/components/form';
import { Input } from '@acme/ui/components/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

interface DangerFormValues {
  confirm: string;
}

export default function AccountDangerPage() {
  const locale = useLocale();
  const t = translate(lang, locale);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<DangerFormValues>({ defaultValues: { confirm: '' } });

  async function onDeleteAccount(values: DangerFormValues) {
    if (values.confirm !== t.confirmWord) return;
    setIsDeleting(true);
    try {
      await authClient.deleteUser({
        fetchOptions: {
          onSuccess: () => {
            window.location.assign('/goodbye');
          }
        }
      });
    } catch (_e) {
      setIsDeleting(false);
      toast.error(t.genericError);
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onDeleteAccount)}>
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.deleteDescription}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.confirmPlaceholder} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <CardFooter className="px-0">
                <Button type="submit" variant="destructive" disabled={isDeleting}>
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : t.delete}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
