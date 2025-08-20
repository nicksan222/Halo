import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('list todos failure', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;

  beforeAll(async () => {
    builder = new TestSetupBuilder({ registerForCleanup: true }).withFounder({
      organization: { name: 'Test Org', slug: `test-org-${Math.random().toString(36).slice(2, 8)}` }
    });
    const { founder } = await builder.create();
    client = await founder!.getApiClient();
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('fails with negative page number', async () => {
    await expect(client.todos.list.all({ page: -1 })).rejects.toThrow();
  });

  test('fails with zero page number', async () => {
    await expect(client.todos.list.all({ page: 0 })).rejects.toThrow();
  });

  test('fails with non-integer page number', async () => {
    await expect(client.todos.list.all({ page: 1.5 } as any)).rejects.toThrow();
  });

  test('fails with null page number', async () => {
    await expect(client.todos.list.all({ page: null } as any)).rejects.toThrow();
  });

  test('succeeds with undefined page number (uses default)', async () => {
    const todos = await client.todos.list.all({ page: undefined } as any);
    expect(Array.isArray(todos)).toBe(true);
  });

  test('fails with string page number', async () => {
    await expect(client.todos.list.all({ page: '1' } as any)).rejects.toThrow();
  });

  test('fails with negative limit', async () => {
    await expect(client.todos.list.all({ limit: -1 })).rejects.toThrow();
  });

  test('fails with zero limit', async () => {
    await expect(client.todos.list.all({ limit: 0 })).rejects.toThrow();
  });

  test('fails with limit exceeding maximum', async () => {
    await expect(client.todos.list.all({ limit: 101 })).rejects.toThrow();
  });

  test('fails with non-integer limit', async () => {
    await expect(client.todos.list.all({ limit: 10.5 } as any)).rejects.toThrow();
  });

  test('fails with null limit', async () => {
    await expect(client.todos.list.all({ limit: null } as any)).rejects.toThrow();
  });

  test('succeeds with undefined limit (uses default)', async () => {
    const todos = await client.todos.list.all({ limit: undefined } as any);
    expect(Array.isArray(todos)).toBe(true);
  });

  test('fails with string limit', async () => {
    await expect(client.todos.list.all({ limit: '20' } as any)).rejects.toThrow();
  });

  test('fails with non-boolean completed filter', async () => {
    await expect(client.todos.list.all({ completed: 'true' } as any)).rejects.toThrow();
  });

  test('fails with null completed filter', async () => {
    await expect(client.todos.list.all({ completed: null } as any)).rejects.toThrow();
  });

  test('succeeds with undefined completed filter (ignored)', async () => {
    const todos = await client.todos.list.all({ completed: undefined } as any);
    expect(Array.isArray(todos)).toBe(true);
  });

  test('fails with number completed filter', async () => {
    await expect(client.todos.list.all({ completed: 1 } as any)).rejects.toThrow();
  });

  test('fails with non-string userId', async () => {
    await expect(client.todos.list.all({ userId: 123 } as any)).rejects.toThrow();
  });

  test('fails with null userId', async () => {
    await expect(client.todos.list.all({ userId: null } as any)).rejects.toThrow();
  });

  test('succeeds with undefined userId (uses session user)', async () => {
    const todos = await client.todos.list.all({ userId: undefined } as any);
    expect(Array.isArray(todos)).toBe(true);
  });

  test('fails with boolean userId', async () => {
    await expect(client.todos.list.all({ userId: true } as any)).rejects.toThrow();
  });

  test('succeeds with empty string userId', async () => {
    const todos = await client.todos.list.all({ userId: '' });
    expect(Array.isArray(todos)).toBe(true);
  });

  test('succeeds with whitespace-only userId', async () => {
    const todos = await client.todos.list.all({ userId: '   ' });
    expect(Array.isArray(todos)).toBe(true);
  });

  test('succeeds with very large page number', async () => {
    const todos = await client.todos.list.all({ page: 999999999 });
    expect(Array.isArray(todos)).toBe(true);
  });

  test('fails with very large limit number', async () => {
    await expect(client.todos.list.all({ limit: 999999999 })).rejects.toThrow();
  });

  test('succeeds with malformed input object (ignores extra fields)', async () => {
    const todos = await client.todos.list.all({ invalidField: 'value' } as any);
    expect(Array.isArray(todos)).toBe(true);
  });

  test('fails with completely invalid input', async () => {
    await expect(client.todos.list.all('not an object' as any)).rejects.toThrow();
  });

  test('fails with null input', async () => {
    await expect(client.todos.list.all(null as any)).rejects.toThrow();
  });

  test('fails with undefined input', async () => {
    await expect(client.todos.list.all(undefined as any)).rejects.toThrow();
  });
});
