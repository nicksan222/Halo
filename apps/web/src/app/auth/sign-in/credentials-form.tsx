'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Button } from '@acme/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@acme/ui/components/card';
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
import { Separator } from '@acme/ui/components/separator';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

const signIn = authClient.signIn;

export type SignInFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export function SignInCredentialsForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const t = translate(lang, locale);

  const form = useForm<SignInFormValues>({
    mode: 'onTouched',
    defaultValues: { email: '', password: '', rememberMe: false }
  });

  async function onSubmit(values: SignInFormValues) {
    await signIn.email(
      {
        email: values.email,
        password: values.password
      },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: async () => {
          onSuccess();
        }
      }
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t.title}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => toast.info('Apple sign-in coming soon')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                    aria-hidden
                  >
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  {t.appleLogin}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => toast.info('Google sign-in coming soon')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                    aria-hidden
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {t.googleLogin}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Separator className="flex-1" />
                <span className="text-sm text-muted-foreground">{t.orContinueWith}</span>
                <Separator className="flex-1" />
              </div>

              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: t.emailRequired,
                    pattern: {
                      value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                      message: t.emailInvalid
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.email}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t.emailPlaceholder}
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: t.passwordRequired,
                    minLength: { value: 6, message: t.passwordMinLength }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>{t.password}</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          {t.forgotPassword}
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t.passwordPlaceholder}
                          autoComplete="current-password"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>{t.rememberMe}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : t.login}
                </Button>
                <div className="text-center text-sm">
                  {t.noAccount}{' '}
                  <Link href="/auth/sign-up" className="underline underline-offset-4">
                    {t.signUp}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-4">
        {t.termsText} <a href="/terms-of-service">{t.termsLink}</a> and{' '}
        <a href="/privacy-policy">{t.privacyLink}</a>.
      </div>
    </>
  );
}
