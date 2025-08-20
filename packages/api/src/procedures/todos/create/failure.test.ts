import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('create todo failure', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;

  beforeAll(async () => {
    builder = new TestSetupBuilder({ registerForCleanup: true }).withFounder({ organization: { name: 'Test Org', slug: `test-org-${Math.random().toString(36).slice(2, 8)}` } });
    const { founder } = await builder.create();
    client = await founder!.getApiClient();
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('fails with empty title', async () => {
    const input = { title: '', description: 'This should fail' };

    await expect(client.todos.create.todo(input)).rejects.toThrow();
  });

  test('succeeds with whitespace-only title', async () => {
    const input = { title: '   ', description: 'This should succeed' };

    const todo = await client.todos.create.todo(input);
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(input.description);
  });

  test('fails with missing title', async () => {
    const input = { description: 'This should fail' } as any;

    await expect(client.todos.create.todo(input)).rejects.toThrow();
  });

  test('fails with null title', async () => {
    const input = { title: null, description: 'This should fail' } as any;

    await expect(client.todos.create.todo(input)).rejects.toThrow();
  });

  test('fails with undefined title', async () => {
    const input = { title: undefined, description: 'This should fail' } as any;

    await expect(client.todos.create.todo(input)).rejects.toThrow();
  });

  test('fails with non-string title', async () => {
    const input = { title: 123, description: 'This should fail' } as any;

    await expect(client.todos.create.todo(input)).rejects.toThrow();
  });

  test('succeeds with empty description', async () => {
    const input = { title: 'Valid title', description: '' };

    const todo = await client.todos.create.todo(input);
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(''); // Empty string should remain empty string
  });

  test('succeeds with undefined description', async () => {
    const input = { title: 'Valid title' };

    const todo = await client.todos.create.todo(input);
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(null); // Undefined should be converted to null
  });

  test('succeeds with undefined description', async () => {
    const input = { title: 'Valid title' };

    const todo = await client.todos.create.todo(input);
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(null);
  });

  test('succeeds with very long title', async () => {
    const longTitle = 'A'.repeat(1000);
    const input = { title: longTitle, description: 'Long title test' };

    const todo = await client.todos.create.todo(input);
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(input.description);
  });

  test('succeeds with very long description', async () => {
    const longDescription = 'B'.repeat(5000);
    const input = { title: 'Valid title', description: longDescription };

    const todo = await client.todos.create.todo(input);
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(input.description);
  });

  test('succeeds with special characters in title', async () => {
    const input = { title: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?', description: 'Special chars test' };

    const todo = await client.todos.create.todo(input);
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(input.description);
  });

  test('succeeds with unicode characters in title', async () => {
    const input = { title: 'Unicode: 🚀🌟🎉中文日本語한국어', description: 'Unicode test' };

    const todo = await client.todos.create.todo(input);
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(input.description);
  });
}); 