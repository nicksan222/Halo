/**
 * Server-side storage wrapper scoped to a prefix.
 * Uses Vercel Blob under the hood and requires BLOB_READ_WRITE_TOKEN.
 */

import { env } from '@acme/env';
import type { StoragePrefixValue } from './prefixes';
import { createS3Strategy } from './providers/s3';
import { createVercelBlobStrategy } from './providers/vercel-blob';
import type {
  ServerPutOptions,
  StorageClientConfig,
  StorageFileMetadata,
  StorageListOptions,
  StorageListResult,
  StorageStrategy
} from './types';

function ensureTrailingSlash(prefix: string): string {
  return prefix.endsWith('/') ? prefix : `${prefix}/`;
}

function configFromEnv(): StorageClientConfig {
  const provider = (env.STORAGE_PROVIDER as StorageClientConfig['provider']) || 'vercel-blob';
  if (provider === 's3') {
    return {
      provider: 's3',
      region: env.S3_REGION,
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_ACCESS_KEY_ID || undefined,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY || undefined,
      endpoint: env.S3_ENDPOINT || undefined,
      forcePathStyle: env.S3_FORCE_PATH_STYLE,
      publicUrlBase: env.S3_PUBLIC_URL || undefined
    };
  }
  return {
    provider: 'vercel-blob',
    token: env.BLOB_READ_WRITE_TOKEN || undefined
  };
}

function buildStrategy(config: StorageClientConfig): StorageStrategy {
  switch (config.provider) {
    case 's3':
      return createS3Strategy(config);
    default:
      return createVercelBlobStrategy(config);
  }
}

export function createStorageClient<P extends StoragePrefixValue>(
  prefix: P,
  explicitConfig?: StorageClientConfig
) {
  const cfg = explicitConfig ?? configFromEnv();
  const strategy = buildStrategy(cfg);
  const normalized = ensureTrailingSlash(prefix);

  return {
    put(
      pathname: string,
      data: Parameters<StorageStrategy['put']>[1],
      options: ServerPutOptions = {}
    ): Promise<StorageFileMetadata<P>> {
      return strategy.put(`${normalized}${pathname}`, data, options) as Promise<
        StorageFileMetadata<P>
      >;
    },
    head(pathname: string): Promise<StorageFileMetadata<P> | null> {
      return strategy.head(`${normalized}${pathname}`) as Promise<StorageFileMetadata<P> | null>;
    },
    list(options: StorageListOptions = {}): Promise<StorageListResult<P>> {
      return strategy.list(normalized, options) as Promise<StorageListResult<P>>;
    },
    delete(pathname: string): Promise<void> {
      return strategy.delete(`${normalized}${pathname}`);
    }
  };
}
