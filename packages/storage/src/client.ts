'use client';

/**
 * Client-side storage wrapper scoped to a prefix.
 * Uploads via Vercel Blob client helper and your handle upload route.
 */
import { type UploadOptions, upload } from '@vercel/blob/client';
import type { StoragePrefixValue } from './prefixes';
import type { ClientUploadOptions, PrefixedPath, StorageFileMetadata } from './types';

function ensureTrailingSlash(prefix: string): string {
  return prefix.endsWith('/') ? prefix : `${prefix}/`;
}

/**
 * Creates a client storage instance scoped to a specific prefix.
 * The returned `upload` auto-prepends the prefix and reflects it in its types.
 */
export function createClientStorage<P extends StoragePrefixValue>(prefix: P) {
  const normalized = ensureTrailingSlash(prefix);
  return {
    /** Upload a File to `${prefix}${pathname}` through your handle route. */
    upload: async (
      pathname: string,
      file: File,
      options: ClientUploadOptions
    ): Promise<StorageFileMetadata<P>> => {
      const payloadString: string | undefined =
        typeof options.clientPayload === 'string'
          ? options.clientPayload
          : options.clientPayload !== undefined
            ? JSON.stringify(options.clientPayload)
            : undefined;

      const uploadOptions: UploadOptions = {
        access: 'public',
        handleUploadUrl: options.handleUploadUrl,
        clientPayload: payloadString,
        headers: options.headers,
        contentType: options.contentType,
        multipart: options.multipart,
        abortSignal: options.abortSignal
      };

      const result = await upload(`${normalized}${pathname}`, file, uploadOptions);
      return {
        pathname: result.pathname as PrefixedPath<P>,
        url: result.url,
        downloadUrl: result.downloadUrl,
        contentType: result.contentType
      };
    }
  };
}
