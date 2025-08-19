# @acme/storage

Typesafe storage wrapper for Vercel Blob, with prefix-scoped factories and full TypeScript/JSDoc.

## Prefixes

```ts
import { StoragePrefix } from '@acme/storage';
// Add/edit prefixes in packages/storage/src/prefixes.ts
```

## Server

```ts
import { createServerStorage, StoragePrefix } from '@acme/storage';

const avatars = createServerStorage(StoragePrefix.Avatars);
await avatars.put('user-123.png', fileOrStream); // Stored at "avatars/user-123.png"
const meta = await avatars.head('user-123.png');
const list = await avatars.list({ limit: 20 });
await avatars.delete('user-123.png');
```

Requires `BLOB_READ_WRITE_TOKEN` available in env; validated by `@acme/env`.

## Client

```ts
'use client'
import { createClientStorage, StoragePrefix } from '@acme/storage';

const covers = createClientStorage(StoragePrefix.Covers);
await covers.upload('post-42.jpg', file, {
  handleUploadUrl: '/api/uploads/handle',
  clientPayload: { postId: 42 }
});
```

## Notes
- All methods are prefix-scoped and return types reflect the prefix using template literal types.
- No unsafe casts are used; all mappings are typed against `@vercel/blob` definitions. 