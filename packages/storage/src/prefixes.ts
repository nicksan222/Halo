/**
 * All allowed storage prefixes in one place.
 * Add new entries here to keep your storage layout typesafe and discoverable.
 */
export const StoragePrefix = {
  Avatars: 'avatars/',
  Covers: 'covers/',
  Attachments: 'attachments/',
  Temp: 'tmp/'
} as const;

/** Keys of StoragePrefix. */
export type StoragePrefixKey = keyof typeof StoragePrefix;
/** Literal prefix value (e.g., 'avatars/'). */
export type StoragePrefixValue = (typeof StoragePrefix)[StoragePrefixKey];

/** Utility to get the literal prefix type for a given key K. */
export type PrefixOf<K extends StoragePrefixKey> = (typeof StoragePrefix)[K];
