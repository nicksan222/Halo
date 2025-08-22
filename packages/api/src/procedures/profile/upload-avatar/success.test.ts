import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { auth } from '@acme/auth';
import { TestSetupBuilder } from '@acme/testing';
import { S3Client } from '@aws-sdk/client-s3';

// Preserve originals to restore after tests
const originalSend = S3Client.prototype.send;
const originalStorageProvider = process.env.STORAGE_PROVIDER;
const originalS3Region = process.env.S3_REGION;
const originalS3Bucket = process.env.S3_BUCKET;
const originalS3PublicUrl = process.env.S3_PUBLIC_URL;

// Track calls to updateUser
const updateUserCalls: any[] = [];
const originalUpdateUser = (auth as any).api.updateUser;

describe('upload avatar success', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;

  beforeAll(async () => {
    // Force storage to use S3 strategy and mock the client send to avoid network
    process.env.STORAGE_PROVIDER = 's3';
    process.env.S3_REGION = 'us-test-1';
    process.env.S3_BUCKET = 'test-bucket';
    process.env.S3_PUBLIC_URL = 'https://cdn.example.com';

    S3Client.prototype.send = async () => {
      // No-op mock; return minimal shape when needed by strategy
      return {} as any;
    };

    // Stub Better Auth updateUser to avoid making external calls
    (auth as any).api.updateUser = async (args: any) => {
      updateUserCalls.push(args);
      return { ok: true };
    };

    builder = new TestSetupBuilder({ registerForCleanup: true }).withFounder({
      organization: { name: 'Test Org', slug: `test-org-${Math.random().toString(36).slice(2, 8)}` }
    });
    const { founder } = await builder.create();
    client = await founder!.getApiClient();
  });

  afterAll(async () => {
    await builder.cleanup();

    // Restore mocks and env
    S3Client.prototype.send = originalSend;
    (auth as any).api.updateUser = originalUpdateUser;
    process.env.STORAGE_PROVIDER = originalStorageProvider;
    process.env.S3_REGION = originalS3Region;
    process.env.S3_BUCKET = originalS3Bucket;
    process.env.S3_PUBLIC_URL = originalS3PublicUrl;
  });

  test('uploads a file, returns metadata, and updates user image', async () => {
    const bytes = new Uint8Array([137, 80, 78, 71]); // PNG signature bytes
    const file = new File([bytes], 'avatar.png', { type: 'image/png' });

    const fd = new FormData();
    fd.append('file', file);
    fd.append('filename', 'my-avatar');

    const result = await client.profile.uploadAvatar.upload(fd);

    expect(result.url).toBeDefined();
    expect(typeof result.url).toBe('string');
    expect(result.pathname).toBeDefined();
    expect(typeof result.pathname).toBe('string');
    expect(result.pathname.startsWith('avatars/')).toBe(true);

    // URL should include the pathname
    expect(result.url.includes(result.pathname)).toBe(true);

    // Ensure Better Auth updateUser was called with the uploaded URL
    const lastCall = updateUserCalls.at(-1);
    expect(lastCall).toBeTruthy();
    expect(lastCall.body?.image).toBe(result.url);
  });
});
