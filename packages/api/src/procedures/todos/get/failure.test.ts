import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('get todo failure', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let otherUserClient: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let createdTodoId: string;

  beforeAll(async () => {
    builder = new TestSetupBuilder({ registerForCleanup: true })
      .withFounder({ organization: { name: 'Test Org', slug: `test-org-${Math.random().toString(36).slice(2, 8)}` } })
      .withFounder({ organization: { name: 'Second Org', slug: `second-org-${Math.random().toString(36).slice(2, 8)}` } });
    
    const { founder } = await builder.create();
    client = await founder!.getApiClient();
    
    // Create a second founder for the other user
    const secondBuilder = new TestSetupBuilder({ registerForCleanup: true })
      .withFounder({ organization: { name: 'Other Org', slug: `other-org-${Math.random().toString(36).slice(2, 8)}` } });
    const { founder: secondFounder } = await secondBuilder.create();
    otherUserClient = await secondFounder!.getApiClient();

    // Create a todo to test with
    const todo = await client.todos.create.todo({
      title: 'Test todo for get failure tests',
      description: 'This todo will be used for failure tests'
    });
    createdTodoId = todo.id;
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('fails with empty ID', async () => {
    await expect(client.todos.get.byId({ id: '' })).rejects.toThrow();
  });

  test('fails with whitespace-only ID', async () => {
    await expect(client.todos.get.byId({ id: '   ' })).rejects.toThrow();
  });

  test('fails with missing ID', async () => {
    await expect(client.todos.get.byId({} as any)).rejects.toThrow();
  });

  test('fails with null ID', async () => {
    await expect(client.todos.get.byId({ id: null } as any)).rejects.toThrow();
  });

  test('fails with undefined ID', async () => {
    await expect(client.todos.get.byId({ id: undefined } as any)).rejects.toThrow();
  });

  test('fails with non-string ID', async () => {
    await expect(client.todos.get.byId({ id: 123 } as any)).rejects.toThrow();
  });

  test('fails with non-existent ID', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    
    await expect(client.todos.get.byId({ id: nonExistentId })).rejects.toThrow('Todo not found');
  });

  test('fails with malformed UUID', async () => {
    const malformedId = 'not-a-valid-uuid';
    
    await expect(client.todos.get.byId({ id: malformedId })).rejects.toThrow('Todo not found');
  });

  test('fails when accessing another user\'s todo', async () => {
    // Try to access the todo created by the founder from the member's client
    await expect(otherUserClient.todos.get.byId({ id: createdTodoId })).rejects.toThrow('Todo not found');
  });

  test('fails with very long ID', async () => {
    const longId = 'A'.repeat(1000);
    
    await expect(client.todos.get.byId({ id: longId })).rejects.toThrow('Todo not found');
  });

  test('fails with special characters in ID', async () => {
    const specialId = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    await expect(client.todos.get.byId({ id: specialId })).rejects.toThrow('Todo not found');
  });

  test('fails with unicode characters in ID', async () => {
    const unicodeId = '🚀🌟🎉中文日本語한국어';
    
    await expect(client.todos.get.byId({ id: unicodeId })).rejects.toThrow('Todo not found');
  });

  test('fails when todo is deleted', async () => {
    // Create a todo
    const todoToDelete = await client.todos.create.todo({
      title: 'Todo to be deleted',
      description: 'This todo will be deleted'
    });

    // Delete it
    await client.todos.delete.todo({ id: todoToDelete.id });

    // Try to get it
    await expect(client.todos.get.byId({ id: todoToDelete.id })).rejects.toThrow('Todo not found');
  });
}); 