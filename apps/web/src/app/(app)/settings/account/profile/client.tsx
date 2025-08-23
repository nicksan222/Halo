'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Button } from '@acme/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@acme/ui/components/card';
import { Dropzone, DropzoneEmptyState } from '@acme/ui/components/dropzone';
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
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLocale } from '@/providers/i18n-provider';
import { api } from '@/trpc/react';
import { lang } from './lang';
import type { ProfileFormValues, ProfilePageProps } from './types';

// Custom dropzone content that shows current avatar or uploaded file preview
const AvatarDropzoneContent = ({
  avatarFiles,
  currentImageUrl
}: {
  avatarFiles?: File[];
  currentImageUrl?: string;
}) => {
  if (avatarFiles && avatarFiles.length > 0) {
    // Show uploaded file preview
    const file = avatarFiles[0];
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-2">
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover"
            onLoad={(e) => {
              URL.revokeObjectURL(e.currentTarget.src);
            }}
          />
        </div>
        <p className="w-full truncate text-wrap text-muted-foreground text-xs">{file.name}</p>
        <p className="w-full text-wrap text-muted-foreground text-xs">
          Drag and drop or click to replace
        </p>
      </div>
    );
  }

  if (currentImageUrl) {
    // Show current avatar
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-2">
          <Image
            src={currentImageUrl}
            alt={t.currentAvatar}
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover"
          />
        </div>
        <p className="w-full text-wrap text-muted-foreground text-xs">{t.currentAvatar}</p>
        <p className="w-full text-wrap text-muted-foreground text-xs">{t.dragAndDrop}</p>
      </div>
    );
  }

  // Show empty state
  return <DropzoneEmptyState />;
};

export function ProfileClient({ user }: ProfilePageProps) {
  const locale = useLocale();
  const t = translate(lang, locale);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarFiles, setAvatarFiles] = useState<File[] | undefined>(undefined);

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: { name: user.name ?? '', image: user.image ?? '' }
  });

  useEffect(() => {
    profileForm.reset({ name: user.name ?? '', image: user.image ?? '' });
  }, [user, profileForm]);

  const uploadAvatarMutation = api.profile.uploadAvatar.upload.useMutation();

  async function onDropAvatar(acceptedFiles: File[]) {
    const file = acceptedFiles.at(0);
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('filename', file.name);

      const res = await uploadAvatarMutation.mutateAsync(fd);
      setAvatarFiles([file]);
      profileForm.setValue('image', res.url, { shouldDirty: true, shouldValidate: true });
      toast.success(t.success);
    } catch (_e) {
      toast.error(t.genericError);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

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
                      <div className="flex flex-col gap-2">
                        {/* Hidden input to keep form value for image URL */}
                        <Input {...field} className="hidden" readOnly />
                        <Dropzone
                          accept={{ 'image/*': [] }}
                          maxFiles={1}
                          disabled={isUploadingAvatar}
                          src={avatarFiles}
                          onDrop={onDropAvatar}
                        >
                          <AvatarDropzoneContent
                            avatarFiles={avatarFiles}
                            currentImageUrl={profileForm.watch('image')}
                          />
                        </Dropzone>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="px-0">
                <Button type="submit" disabled={isUpdatingProfile || isUploadingAvatar}>
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
