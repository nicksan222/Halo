/**
 * Common storage types for the Vercel Blob wrapper.
 * These are intentionally aligned with the SDK while staying provider-agnostic.
 */

/**
 * A path that is guaranteed to start with the given prefix P.
 */
export type PrefixedPath<P extends string> = `${P}${string}`;

/**
 * Options for server-side put operations.
 * Mirrors a safe subset of @vercel/blob PutCommandOptions.
 */
export interface ServerPutOptions {
  /** Adds a random suffix to avoid name collisions. */
  addRandomSuffix?: boolean;
  /** Number of seconds to configure cache duration (min 60). */
  cacheControlMaxAge?: number;
  /** Explicit content type; inferred from filename if omitted. */
  contentType?: string;
  /** Allow overwriting an existing blob with the same pathname. */
  allowOverwrite?: boolean;
  /** Enable multipart upload for large files. */
  multipart?: boolean;
}

/**
 * Options for client-side upload operations.
 * Mirrors a safe subset of @vercel/blob/client UploadOptions and related fields.
 */
export interface ClientUploadOptions {
  /** Route that implements `handleUpload` to generate client tokens. */
  handleUploadUrl: string;
  /** Arbitrary payload to send to your handle route. Will be JSON.stringified when not a string. */
  clientPayload?: unknown;
  /** Custom headers to include when contacting `handleUploadUrl`. */
  headers?: Record<string, string>;
  /** Explicit content type; inferred from filename if omitted. */
  contentType?: string;
  /** Enable multipart upload for large files. */
  multipart?: boolean;
  /** Abort signal to cancel the in-flight upload. */
  abortSignal?: AbortSignal;
}

/**
 * Basic metadata about a stored file/blob. Generic parameter P encodes the prefix.
 */
export interface StorageFileMetadata<P extends string = string> {
  /** Pathname within the store, always includes the prefix. */
  pathname: PrefixedPath<P>;
  /** Public URL of the blob. */
  url: string;
  /** Download URL that forces attachment behavior. */
  downloadUrl?: string;
  /** Size in bytes when available (e.g., list/head). */
  size?: number;
  /** Upload date when available (e.g., list/head). */
  uploadedAt?: Date;
  /** MIME type when available. */
  contentType?: string;
}

/**
 * Options when listing blobs under a prefix.
 */
export interface StorageListOptions {
  /** Max number of blobs to return. */
  limit?: number;
  /** Pagination cursor returned by the previous list call. */
  cursor?: string;
}

/**
 * Result of listing blobs; generic parameter P encodes the prefix of returned pathnames.
 */
export interface StorageListResult<P extends string = string> {
  blobs: StorageFileMetadata<P>[];
  next?: string | null;
}
