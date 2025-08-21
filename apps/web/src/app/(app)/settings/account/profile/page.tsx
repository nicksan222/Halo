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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { lang } from './lang';

interface ProfileFormValues {
  name: string;
  image?: string;
}

export default function AccountProfilePage() {
  const locale = useLocale();
  const t = translate(lang, locale);
  const { data: session } = authClient.useSession();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: { name: '', image: '' }
  });

  useEffect(() => {
    if (session?.user) {
      profileForm.reset({ name: session.user.name ?? '', image: session.user.image ?? '' });
    }
  }, [session?.user, profileForm]);

  async function onSubmitProfile(values: ProfileFormValues) {
    setIsUpdatingProfile(true);
    try {
      await authClient.updateUser({ name: values.name, image: values.image });
      await authClient.getSession();
      toast.success(t.success);
    } catch (_e) {
      toast.error(t.genericError);
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form className="space-y-4" onSubmit={profileForm.handleSubmit(onSubmitProfile)}>
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.nameLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.namePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.imageLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.imagePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0">
                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : t.save}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
