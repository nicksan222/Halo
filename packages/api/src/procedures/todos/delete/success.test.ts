import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('delete todo success', () => {
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

  test('deletes a todo and returns the deleted todo', async () => {
    // Create a todo to delete
    const todo = await client.todos.create.todo({
      title: 'Todo to be deleted',
      description: 'This todo will be deleted'
    });

    const deletedTodo = await client.todos.delete.todo({ id: todo.id });

    expect(deletedTodo).toBeDefined();
    expect(deletedTodo!.id).toBe(todo.id);
    expect(deletedTodo!.title).toBe('Todo to be deleted');
    expect(deletedTodo!.description).toBe('This todo will be deleted');
    expect(deletedTodo!.completed).toBe(false);
    expect(deletedTodo!.userId).toBeDefined();
    expect(deletedTodo!.createdAt).toBeInstanceOf(Date);
    expect(deletedTodo!.updatedAt).toBeInstanceOf(Date);
  });

  test('deletes a completed todo', async () => {
    // Create and complete a todo
    const todo = await client.todos.create.todo({
      title: 'Completed todo to delete',
      description: 'This completed todo will be deleted'
    });

    await client.todos.update.todo({
      id: todo.id,
      completed: true
    });

    const deletedTodo = await client.todos.delete.todo({ id: todo.id });

    expect(deletedTodo).toBeDefined();
    expect(deletedTodo!.id).toBe(todo.id);
    expect(deletedTodo!.completed).toBe(true);
  });

  test('deletes a todo with null description', async () => {
    // Create a todo with null description
    const todo = await client.todos.create.todo({
      title: 'Todo with null description'
    });

    const deletedTodo = await client.todos.delete.todo({ id: todo.id });

    expect(deletedTodo).toBeDefined();
    expect(deletedTodo!.id).toBe(todo.id);
    expect(deletedTodo!.description).toBe(null);
  });

  test('deletes a todo with special characters', async () => {
    // Create a todo with special characters
    const todo = await client.todos.create.todo({
      title: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      description: 'Unicode: 🚀🌟🎉中文日本語한국어'
    });

    const deletedTodo = await client.todos.delete.todo({ id: todo.id });

    expect(deletedTodo).toBeDefined();
    expect(deletedTodo!.id).toBe(todo.id);
    expect(deletedTodo!.title).toBe('Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?');
    expect(deletedTodo!.description).toBe('Unicode: 🚀🌟🎉中文日本語한국어');
  });

  test('deletes multiple todos independently', async () => {
    // Create multiple todos
    const todo1 = await client.todos.create.todo({
      title: 'First todo to delete',
      description: 'First description'
    });

    const todo2 = await client.todos.create.todo({
      title: 'Second todo to delete',
      description: 'Second description'
    });

    // Delete both todos
    const deleted1 = await client.todos.delete.todo({ id: todo1.id });
    const deleted2 = await client.todos.delete.todo({ id: todo2.id });

    expect(deleted1).toBeDefined();
    expect(deleted1!.id).toBe(todo1.id);
    expect(deleted1!.title).toBe('First todo to delete');

    expect(deleted2).toBeDefined();
    expect(deleted2!.id).toBe(todo2.id);
    expect(deleted2!.title).toBe('Second todo to delete');
  });

  test('deletes todo and verifies it is no longer accessible', async () => {
    // Create a todo
    const todo = await client.todos.create.todo({
      title: 'Todo to verify deletion',
      description: 'This todo will be deleted and verified'
    });

    // Delete it
    const deletedTodo = await client.todos.delete.todo({ id: todo.id });

    expect(deletedTodo).toBeDefined();
    expect(deletedTodo!.id).toBe(todo.id);

    // Verify it can no longer be retrieved
    await expect(client.todos.get.byId({ id: todo.id })).rejects.toThrow('Todo not found');

    // Verify it can no longer be updated
    await expect(
      client.todos.update.todo({
        id: todo.id,
        title: 'Updated after deletion'
      })
    ).rejects.toThrow('Todo not found');

    // Verify it can no longer be deleted (should return null)
    const secondDelete = await client.todos.delete.todo({ id: todo.id });
    expect(secondDelete).toBeNull();
  });

  test('deletes todo and verifies it is not in list', async () => {
    // Create a todo
    const todo = await client.todos.create.todo({
      title: 'Todo to check in list',
      description: 'This todo will be deleted and checked in list'
    });

    // Verify it exists in list
    const todosBefore = await client.todos.list.all({});
    expect(todosBefore.find((t) => t.id === todo.id)).toBeDefined();

    // Delete it
    await client.todos.delete.todo({ id: todo.id });

    // Verify it no longer exists in list
    const todosAfter = await client.todos.list.all({});
    expect(todosAfter.find((t) => t.id === todo.id)).toBeUndefined();
  });

  test('deletes todo with very long title and description', async () => {
    const longTitle = 'A'.repeat(1000);
    const longDescription = 'B'.repeat(5000);

    // Create a todo with long content
    const todo = await client.todos.create.todo({
      title: longTitle,
      description: longDescription
    });

    const deletedTodo = await client.todos.delete.todo({ id: todo.id });

    expect(deletedTodo).toBeDefined();
    expect(deletedTodo!.id).toBe(todo.id);
    expect(deletedTodo!.title).toBe(longTitle);
    expect(deletedTodo!.description).toBe(longDescription);
  });

  test('deletes todo and returns null for non-existent todo', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';

    const result = await client.todos.delete.todo({ id: nonExistentId });

    expect(result).toBeNull();
  });

  test('deletes todo with malformed UUID (should return null)', async () => {
    const malformedId = 'not-a-valid-uuid';

    const result = await client.todos.delete.todo({ id: malformedId });

    expect(result).toBeNull();
  });
});
