/** Public types */

/**
 * Factory to create a client-side storage instance scoped to a given prefix.
 */
export { createClientStorage } from './client';
export type { StoragePrefixKey, StoragePrefixValue } from './prefixes';
/**
 * Allowed storage prefixes. Update in one place to keep pathing consistent and typesafe.
 */
export { StoragePrefix } from './prefixes';

/**
 * Factory to create a server-side storage instance scoped to a given prefix.
 */
export { createServerStorage } from './server';
export type {
  ClientUploadOptions,
  PrefixedPath,
  ServerPutOptions,
  StorageFileMetadata,
  StorageListOptions,
  StorageListResult
} from './types';
