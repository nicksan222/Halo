/**
 * Server-side storage wrapper scoped to a prefix.
 * Uses Vercel Blob under the hood and requires BLOB_READ_WRITE_TOKEN.
 */

import { env } from '@acme/env';
import {
  del as blobDelete,
  head as blobHead,
  list as blobList,
  put as blobPut,
  type HeadBlobResult,
  type ListBlobResultBlob,
  type ListCommandOptions,
  type PutBlobResult,
  type PutCommandOptions
} from '@vercel/blob';
import type { StoragePrefixValue } from './prefixes';
import type {
  PrefixedPath,
  ServerPutOptions,
  StorageFileMetadata,
  StorageListOptions,
  StorageListResult
} from './types';

function mapPutResultToMetadata<P extends string>(result: PutBlobResult): StorageFileMetadata<P> {
  return {
    pathname: result.pathname as PrefixedPath<P>,
    url: result.url,
    downloadUrl: result.downloadUrl,
    contentType: result.contentType
  };
}

function mapListBlobToMetadata<P extends string>(blob: ListBlobResultBlob): StorageFileMetadata<P> {
  return {
    pathname: blob.pathname as PrefixedPath<P>,
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    size: blob.size,
    uploadedAt: blob.uploadedAt
  };
}

function mapHeadResultToMetadata<P extends string>(result: HeadBlobResult): StorageFileMetadata<P> {
  return {
    pathname: result.pathname as PrefixedPath<P>,
    url: result.url,
    downloadUrl: result.downloadUrl,
    size: result.size,
    uploadedAt: result.uploadedAt,
    contentType: result.contentType
  };
}

type PutBodyInput = Parameters<typeof blobPut>[1];

function ensureTrailingSlash(prefix: string): string {
  return prefix.endsWith('/') ? prefix : `${prefix}/`;
}

/**
 * Creates a server storage instance scoped to a specific prefix.
 * The returned methods auto-prepend the prefix and reflect it in their types.
 */
export function createServerStorage<P extends StoragePrefixValue>(prefix: P) {
  const normalized = ensureTrailingSlash(prefix);
  return {
    /** Upload content to `${prefix}${pathname}`. */
    put: async (
      pathname: string,
      data: PutBodyInput,
      options: ServerPutOptions = {}
    ): Promise<StorageFileMetadata<P>> => {
      const putOptions: PutCommandOptions = {
        access: 'public',
        addRandomSuffix: options.addRandomSuffix,
        cacheControlMaxAge: options.cacheControlMaxAge,
        contentType: options.contentType,
        allowOverwrite: options.allowOverwrite,
        multipart: options.multipart,
        token: env.BLOB_READ_WRITE_TOKEN || undefined
      };
      const result = await blobPut(`${normalized}${pathname}`, data, putOptions);
      return mapPutResultToMetadata<P>(result);
    },

    /** Get metadata for `${prefix}${pathname}`. */
    head: async (pathname: string): Promise<StorageFileMetadata<P> | null> => {
      const info = await blobHead(`${normalized}${pathname}`, {
        token: env.BLOB_READ_WRITE_TOKEN || undefined
      });
      return info ? mapHeadResultToMetadata<P>(info) : null;
    },

    /** List blobs under the given `prefix`. */
    list: async (options: StorageListOptions = {}): Promise<StorageListResult<P>> => {
      const listOptions: ListCommandOptions = {
        prefix: normalized,
        limit: options.limit,
        cursor: options.cursor,
        token: env.BLOB_READ_WRITE_TOKEN || undefined
      };
      const { blobs, cursor } = await blobList(listOptions);
      return {
        blobs: blobs.map((b) => mapListBlobToMetadata<P>(b)),
        next: cursor ?? null
      };
    },

    /** Delete `${prefix}${pathname}`. */
    delete: async (pathname: string): Promise<void> => {
      await blobDelete(`${normalized}${pathname}`, {
        token: env.BLOB_READ_WRITE_TOKEN || undefined
      });
    }
  };
}
