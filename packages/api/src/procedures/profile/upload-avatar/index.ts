import { createStorageClient, StoragePrefix } from '@acme/storage';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { uploadAvatarInput } from './input';

function safeExtensionFromContentType(contentType: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif'
  };
  return map[contentType] ?? 'bin';
}

function sanitizeBaseName(name: string): string {
  return name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
}

function ensureExtension(baseName: string, contentType: string): string {
  const hasExt = /\.[a-zA-Z0-9]+$/.test(baseName);
  if (hasExt) return baseName;
  const ext = safeExtensionFromContentType(contentType);
  return `${baseName}.${ext}`;
}

export const uploadAvatarRouter = router({
  upload: protectedProcedure.input(uploadAvatarInput).mutation(async ({ ctx, input }) => {
    const { session } = ctx;
    const userId = session!.user.id;

    const filePart = input.get('file');
    if (!(filePart instanceof Blob)) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing file field in form data' });
    }
    const file = filePart as Blob;
    const providedName =
      input.get('filename')?.toString() ?? (file instanceof File ? file.name : undefined);
    const contentType = (file as any).type || 'application/octet-stream';

    const avatars = createStorageClient(StoragePrefix.Avatars);

    const base = sanitizeBaseName(providedName || `avatar-${userId}`);
    const finalName = ensureExtension(base, contentType);

    const uploaded = await avatars.put(finalName, file, {
      contentType,
      addRandomSuffix: true,
      allowOverwrite: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365
    });

    await ctx.auth.api.updateUser({
      headers: ctx.headers,
      body: { image: uploaded.url }
    });

    return {
      url: uploaded.url,
      pathname: uploaded.pathname
    };
  })
});
