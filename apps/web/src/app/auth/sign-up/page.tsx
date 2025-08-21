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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@acme/ui/components/form';
import { Input } from '@acme/ui/components/input';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { lang } from '@/app/(app)/lang';
import { useLocale } from '@/providers/i18n-provider';

const signUp = authClient.signUp;

type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default function SignUp() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const t = translate(lang, locale);

  const imageId = useId();

  const form = useForm<SignUpFormValues>({
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: SignUpFormValues) {
    if (values.password !== values.passwordConfirmation) {
      toast.error(t.signUp.passwordsDoNotMatch);
      return;
    }

    await signUp.email({
      email: values.email,
      password: values.password,
      name: `${values.firstName} ${values.lastName}`,
      image: image ? await convertImageToBase64(image) : '',
      callbackURL: '/',
      fetchOptions: {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: async () => {
          router.push('/');
        }
      }
    });
  }

  return (
    <>
      <Card className="z-50 w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t.signUp.title}</CardTitle>
          <CardDescription>{t.signUp.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: t.signUp.firstNameRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.signUp.firstName}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.signUp.firstNamePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: t.signUp.lastNameRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.signUp.lastName}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.signUp.lastNamePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: t.signUp.emailRequired,
                  pattern: {
                    value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                    message: t.signUp.emailInvalid
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.signUp.email}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t.signUp.emailPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: t.signUp.passwordRequired,
                  minLength: { value: 6, message: t.signUp.passwordMinLength }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.signUp.password}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t.signUp.passwordPlaceholder}
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirmation"
                rules={{
                  required: t.signUp.confirmPasswordRequired,
                  validate: (value) =>
                    value === form.getValues('password') || t.signUp.passwordsDoNotMatch
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.signUp.confirmPassword}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t.signUp.confirmPasswordPlaceholder}
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.signUp.profileImage}</span>
                  <span className="text-muted-foreground text-xs">{t.signUp.optional}</span>
                </div>
                <div className="flex items-end gap-4">
                  {imagePreview && (
                    <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      id={imageId}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                    />
                    {imagePreview && (
                      <X
                        className="cursor-pointer"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : t.signUp.createAccount}
              </Button>
              <div className="text-center text-sm">
                {t.signUp.alreadyHaveAccount}{' '}
                <Link href="/auth/sign-in" className="underline underline-offset-4">
                  {t.signUp.signIn}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-4">
        {t.signUp.termsText} <a href="/terms">{t.signUp.termsLink}</a> and{' '}
        <a href="/privacy">{t.signUp.privacyLink}</a>.
      </div>
    </>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
