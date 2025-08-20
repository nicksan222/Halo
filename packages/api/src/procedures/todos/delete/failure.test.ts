import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('delete todo failure', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let otherUserClient: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let createdTodoId: string;

  beforeAll(async () => {
    builder = new TestSetupBuilder({ registerForCleanup: true }).withFounder({
      organization: { name: 'Test Org', slug: `test-org-${Math.random().toString(36).slice(2, 8)}` }
    });

    const { founder } = await builder.create();
    client = await founder!.getApiClient();

    // Create a second founder for the other user
    const secondBuilder = new TestSetupBuilder({ registerForCleanup: true }).withFounder({
      organization: {
        name: 'Other Org',
        slug: `other-org-${Math.random().toString(36).slice(2, 8)}`
      }
    });
    const { founder: secondFounder } = await secondBuilder.create();
    otherUserClient = await secondFounder!.getApiClient();

    // Create a todo to test with
    const todo = await client.todos.create.todo({
      title: 'Test todo for delete failure tests',
      description: 'This todo will be used for failure tests'
    });
    createdTodoId = todo.id;
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('fails with empty ID', async () => {
    await expect(client.todos.delete.todo({ id: '' })).rejects.toThrow();
  });

  test('returns null for whitespace-only ID', async () => {
    const result = await client.todos.delete.todo({ id: '   ' });
    expect(result).toBeNull();
  });

  test('fails with missing ID', async () => {
    await expect(client.todos.delete.todo({} as any)).rejects.toThrow();
  });

  test('fails with null ID', async () => {
    await expect(client.todos.delete.todo({ id: null } as any)).rejects.toThrow();
  });

  test('fails with undefined ID', async () => {
    await expect(client.todos.delete.todo({ id: undefined } as any)).rejects.toThrow();
  });

  test('fails with non-string ID', async () => {
    await expect(client.todos.delete.todo({ id: 123 } as any)).rejects.toThrow();
  });

  test('returns null for non-existent ID', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';

    const result = await client.todos.delete.todo({ id: nonExistentId });
    expect(result).toBeNull();
  });

  test('returns null for malformed UUID', async () => {
    const malformedId = 'not-a-valid-uuid';

    const result = await client.todos.delete.todo({ id: malformedId });
    expect(result).toBeNull();
  });

  test("returns null when trying to delete another user's todo", async () => {
    // Try to delete the todo created by the founder from the member's client
    const result = await otherUserClient.todos.delete.todo({ id: createdTodoId });
    expect(result).toBeNull();
  });

  test('returns null for very long ID', async () => {
    const longId = 'A'.repeat(1000);

    const result = await client.todos.delete.todo({ id: longId });
    expect(result).toBeNull();
  });

  test('returns null for special characters in ID', async () => {
    const specialId = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const result = await client.todos.delete.todo({ id: specialId });
    expect(result).toBeNull();
  });

  test('returns null for unicode characters in ID', async () => {
    const unicodeId = '🚀🌟🎉中文日本語한국어';

    const result = await client.todos.delete.todo({ id: unicodeId });
    expect(result).toBeNull();
  });

  test('returns null for already deleted todo', async () => {
    // Create a todo
    const todoToDelete = await client.todos.create.todo({
      title: 'Todo to be deleted twice',
      description: 'This todo will be deleted twice'
    });

    // Delete it first time
    const firstDelete = await client.todos.delete.todo({ id: todoToDelete.id });
    expect(firstDelete).toBeDefined();
    expect(firstDelete!.id).toBe(todoToDelete.id);

    // Try to delete it again
    const secondDelete = await client.todos.delete.todo({ id: todoToDelete.id });
    expect(secondDelete).toBeNull();
  });

  test('fails with completely invalid input', async () => {
    await expect(client.todos.delete.todo('not an object' as any)).rejects.toThrow();
  });

  test('fails with null input', async () => {
    await expect(client.todos.delete.todo(null as any)).rejects.toThrow();
  });

  test('fails with undefined input', async () => {
    await expect(client.todos.delete.todo(undefined as any)).rejects.toThrow();
  });

  test('succeeds with malformed input object (ignores extra fields)', async () => {
    const result = await client.todos.delete.todo({
      id: createdTodoId,
      invalidField: 'value'
    } as any);
    expect(result).toBeDefined();
  });

  test('succeeds with extra fields in input (ignores extra fields)', async () => {
    const result = await client.todos.delete.todo({
      id: createdTodoId,
      title: 'Extra field'
    } as any);
    expect(result).toBeDefined();
  });
});
