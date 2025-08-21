'use client';

import { authClient } from '@acme/auth/client';
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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

interface EmailFormValues {
  email: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSecurityPage() {
  const locale = useLocale();
  const t = translate(lang, locale);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const emailForm = useForm<EmailFormValues>({ defaultValues: { email: '' } });
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
  });

  async function onSubmitEmail(values: EmailFormValues) {
    setIsChangingEmail(true);
    try {
      await authClient.changeEmail({ newEmail: values.email, callbackURL: '/' });
      toast.success(t.email.success);
    } catch (_e) {
      toast.error(t.genericError);
    } finally {
      setIsChangingEmail(false);
    }
  }

  async function onSubmitPassword(values: PasswordFormValues) {
    if (values.newPassword !== values.confirmPassword) {
      toast.error(t.password.mismatch);
      return;
    }
    setIsChangingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true
      });
      toast.success(t.password.success);
      passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (_e) {
      toast.error(t.genericError);
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.email.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form className="space-y-4" onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.email.emailLabel}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t.email.emailPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0">
                <Button type="submit" disabled={isChangingEmail}>
                  {isChangingEmail ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    t.email.change
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.password.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.password.currentLabel}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.password.newLabel}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.password.confirmLabel}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    t.password.change
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
