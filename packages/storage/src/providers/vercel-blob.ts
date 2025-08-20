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
import type {
  ServerPutOptions,
  StorageFileMetadata,
  StorageListOptions,
  StorageListResult,
  StorageStrategy,
  VercelBlobConfig
} from '../types';

function mapPutResultToMetadata(result: PutBlobResult): StorageFileMetadata {
  return {
    pathname: result.pathname as StorageFileMetadata['pathname'],
    url: result.url,
    downloadUrl: result.downloadUrl,
    contentType: result.contentType
  };
}

function mapListBlobToMetadata(blob: ListBlobResultBlob): StorageFileMetadata {
  return {
    pathname: blob.pathname as StorageFileMetadata['pathname'],
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    size: blob.size,
    uploadedAt: blob.uploadedAt
  };
}

function mapHeadResultToMetadata(result: HeadBlobResult): StorageFileMetadata {
  return {
    pathname: result.pathname as StorageFileMetadata['pathname'],
    url: result.url,
    downloadUrl: result.downloadUrl,
    size: result.size,
    uploadedAt: result.uploadedAt,
    contentType: result.contentType
  };
}

export function createVercelBlobStrategy(config: VercelBlobConfig): StorageStrategy {
  return {
    async put(pathname, data, options: ServerPutOptions = {}) {
      const putOptions: PutCommandOptions = {
        access: 'public',
        addRandomSuffix: options.addRandomSuffix,
        cacheControlMaxAge: options.cacheControlMaxAge,
        contentType: options.contentType,
        allowOverwrite: options.allowOverwrite,
        multipart: options.multipart,
        token: config.token
      };
      const result = await blobPut(pathname, data as Parameters<typeof blobPut>[1], putOptions);
      return mapPutResultToMetadata(result);
    },
    async head(pathname) {
      const info = await blobHead(pathname, { token: config.token });
      return info ? mapHeadResultToMetadata(info) : null;
    },
    async list(prefix: string, options: StorageListOptions = {}): Promise<StorageListResult> {
      const listOptions: ListCommandOptions = {
        prefix,
        limit: options.limit,
        cursor: options.cursor,
        token: config.token
      };
      const { blobs, cursor } = await blobList(listOptions);
      return {
        blobs: blobs.map((b) => mapListBlobToMetadata(b)),
        next: cursor ?? null
      };
    },
    async delete(pathname: string) {
      await blobDelete(pathname, { token: config.token });
    }
  };
}
