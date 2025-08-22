import {
  type _Object,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig
} from '@aws-sdk/client-s3';
import type {
  S3Config,
  ServerPutOptions,
  StorageFileMetadata,
  StorageListOptions,
  StorageListResult,
  StorageStrategy
} from '../types';

function buildClient(config: S3Config): S3Client {
  const clientConfig: S3ClientConfig = {
    region: config.region,
    credentials:
      config.accessKeyId && config.secretAccessKey
        ? { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey }
        : undefined,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle
  };
  return new S3Client(clientConfig);
}

function objectUrl(config: S3Config, key: string): string {
  if (config.publicUrlBase) {
    return `${config.publicUrlBase.replace(/\/$/, '')}/${key}`;
  }
  // Fallback to virtual-hosted-style if possible
  const base = config.endpoint?.replace(/\/$/, '') ?? `https://s3.${config.region}.amazonaws.com`;
  return `${base}/${config.bucket}/${key}`;
}

async function toUploadBody(
  data: unknown
): Promise<{ body: any; contentType?: string; contentLength?: number }> {
  // Prefer Buffer to avoid hashing issues with flowing streams
  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    const arrayBuffer = await data.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const contentLength = body.length;
    const contentType = (data as any).type || undefined;
    return { body, contentType, contentLength };
  }
  if (data instanceof Uint8Array) {
    return { body: Buffer.from(data), contentLength: data.byteLength };
  }
  if (data instanceof ArrayBuffer) {
    const body = Buffer.from(data);
    return { body, contentLength: body.length };
  }
  // Node.js Buffer
  if (typeof Buffer !== 'undefined' && (Buffer as any).isBuffer?.(data)) {
    return { body: data as any, contentLength: (data as any).length };
  }
  // Fallback: pass through (may be a Node stream); S3 client will handle if possible
  return { body: data as any };
}

export function createS3Strategy(config: S3Config): StorageStrategy {
  const client = buildClient(config);

  return {
    async put(pathname, data, options: ServerPutOptions = {}) {
      const key = pathname;
      const { body, contentType: inferredType, contentLength } = await toUploadBody(data);
      const contentType = options.contentType ?? inferredType;
      const put = new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: body as any,
        ContentType: contentType,
        // Provide length when known to avoid hashing issues
        // ContentLength is allowed by the AWS SDK types when using the broader runtime type
        ContentLength: contentLength as any,
        CacheControl: options.cacheControlMaxAge
          ? `max-age=${options.cacheControlMaxAge}`
          : undefined
      } as any);
      await client.send(put);
      const url = objectUrl(config, key);
      return {
        pathname: key as StorageFileMetadata['pathname'],
        url,
        downloadUrl: url,
        contentType
      };
    },
    async head(pathname) {
      const key = pathname;
      try {
        const res = await client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: key }));
        return {
          pathname: key as StorageFileMetadata['pathname'],
          url: objectUrl(config, key),
          downloadUrl: objectUrl(config, key),
          size: Number(res.ContentLength ?? 0),
          uploadedAt: res.LastModified ?? undefined,
          contentType: res.ContentType ?? undefined
        };
      } catch (err: any) {
        if (err?.$metadata?.httpStatusCode === 404) return null;
        throw err;
      }
    },
    async list(prefix, options: StorageListOptions = {}): Promise<StorageListResult> {
      const res = await client.send(
        new ListObjectsV2Command({
          Bucket: config.bucket,
          Prefix: prefix,
          MaxKeys: options.limit,
          ContinuationToken: options.cursor
        })
      );
      return {
        blobs:
          (res.Contents as _Object[] | undefined)?.map((obj: _Object) => ({
            pathname: (obj.Key ?? '') as StorageFileMetadata['pathname'],
            url: objectUrl(config, obj.Key ?? ''),
            size: obj.Size ? Number(obj.Size) : undefined,
            uploadedAt: obj.LastModified ?? undefined
          })) ?? [],
        next: res.NextContinuationToken ?? null
      };
    },
    async delete(pathname: string) {
      await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: pathname }));
    }
  };
}
