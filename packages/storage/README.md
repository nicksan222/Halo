# @acme/storage

Strategy-based storage package supporting Vercel Blob and S3-compatible storage (AWS S3, MinIO) with a unified API.

## Features

- **Provider-agnostic API**: Same interface regardless of underlying storage
- **Multiple providers**: `vercel-blob`, `s3` (AWS S3 or MinIO)
- **Prefix-scoped helpers**: Keep your paths consistent and type-safe
- **Environment-based configuration**: Zero code changes to switch providers
- **Type-safe configuration**: All env vars validated via `@acme/env`

## Usage

```ts
import { createStorageClient, StoragePrefix } from '@acme/storage';

const avatars = createStorageClient(StoragePrefix.Avatars);
await avatars.put('user-123.png', fileOrStream);
const meta = await avatars.head('user-123.png');
const list = await avatars.list({ limit: 20 });
await avatars.delete('user-123.png');
```

## Provider Selection

Controlled by `STORAGE_PROVIDER`: `'vercel-blob' | 's3'` (default: `'vercel-blob'`).

### Vercel Blob

Requires `BLOB_READ_WRITE_TOKEN` for server operations when not running on Vercel.

### S3 / MinIO

Required env:
- `S3_REGION`
- `S3_BUCKET`

Optional env:
- `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (use IAM or instance profile if omitted)
- `S3_ENDPOINT` (e.g. `http://localhost:9000` for MinIO)
- `S3_FORCE_PATH_STYLE` (recommended `true` for MinIO)
- `S3_PUBLIC_URL` (base URL for public object access, e.g. `http://localhost:9000/acme`)

## Prefixes

```ts
import { StoragePrefix } from '@acme/storage';
// Add/edit prefixes in packages/storage/src/prefixes.ts
```

## Notes
- All methods are prefix-scoped and return types reflect the prefix using template literal types.
- The S3 provider constructs `url` and `downloadUrl` using `S3_PUBLIC_URL` when provided; otherwise falls back to endpoint/bucket path. 