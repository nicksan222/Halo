/**
 * Strategy-based storage client supporting 'vercel-blob' and 's3'.
 *
 * Usage:
 * import { createStorageClient, StoragePrefix } from '@acme/storage';
 * const avatars = createStorageClient(StoragePrefix.Avatars);
 * await avatars.put('user-1.png', data);
 */

export type { StoragePrefixKey, StoragePrefixValue } from './prefixes';
export { StoragePrefix } from './prefixes';
export { createStorageClient } from './server';
export type {
  ServerPutOptions,
  StorageClientConfig,
  StorageFileMetadata,
  StorageListOptions,
  StorageListResult,
  StorageProvider
} from './types';
