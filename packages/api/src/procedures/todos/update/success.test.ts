import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('update todo success', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let createdTodoId: string;

  beforeAll(async () => {
    builder = new TestSetupBuilder({ registerForCleanup: true }).withFounder({ organization: { name: 'Test Org', slug: `test-org-${Math.random().toString(36).slice(2, 8)}` } });
    const { founder } = await builder.create();
    client = await founder!.getApiClient();

    // Create a todo to test with
    const todo = await client.todos.create.todo({
      title: 'Original title',
      description: 'Original description'
    });
    createdTodoId = todo.id;
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('updates title only', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      title: 'Updated title'
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBe('Updated title');
    expect(updatedTodo.description).toBe('Original description');
    expect(updatedTodo.completed).toBe(false);
    expect(updatedTodo.updatedAt).toBeInstanceOf(Date);
  });

  test('updates description only', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      description: 'Updated description'
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBe('Updated title'); // From previous test
    expect(updatedTodo.description).toBe('Updated description');
    expect(updatedTodo.completed).toBe(false);
  });

  test('updates completed status only', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      completed: true
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBe('Updated title');
    expect(updatedTodo.description).toBe('Updated description');
    expect(updatedTodo.completed).toBe(true);
  });

  test('updates multiple fields at once', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      title: 'Multi-updated title',
      description: 'Multi-updated description',
      completed: false
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBe('Multi-updated title');
    expect(updatedTodo.description).toBe('Multi-updated description');
    expect(updatedTodo.completed).toBe(false);
  });

  test('updates title to empty string (should fail validation)', async () => {
    await expect(client.todos.update.todo({
      id: createdTodoId,
      title: ''
    })).rejects.toThrow();
  });

  test('updates description to empty string', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      description: ''
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.description).toBe('');
  });

  test('updates description to empty string', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      description: ''
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.description).toBe('');
  });

  test('updates with special characters', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      title: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      description: 'Unicode: 🚀🌟🎉中文日本語한국어'
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBe('Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?');
    expect(updatedTodo.description).toBe('Unicode: 🚀🌟🎉中文日本語한국어');
  });

  test('updates with very long text', async () => {
    const longTitle = 'A'.repeat(1000);
    const longDescription = 'B'.repeat(5000);

    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      title: longTitle,
      description: longDescription
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBe(longTitle);
    expect(updatedTodo.description).toBe(longDescription);
  });

  test('updates only completed status multiple times', async () => {
    // Toggle completed status
    let updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      completed: true
    });
    expect(updatedTodo.completed).toBe(true);

    updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      completed: false
    });
    expect(updatedTodo.completed).toBe(false);

    updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      completed: true
    });
    expect(updatedTodo.completed).toBe(true);
  });

  test('updates with whitespace-only title', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      title: '   '
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBe('   ');
  });

  test('updates updatedAt timestamp', async () => {
    const beforeUpdate = new Date();
    
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      title: 'Timestamp test'
    });

    const afterUpdate = new Date();
    
    expect(updatedTodo.updatedAt).toBeInstanceOf(Date);
    expect(updatedTodo.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    expect(updatedTodo.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
  });

  test('updates multiple todos independently', async () => {
    // Create another todo
    const todo2 = await client.todos.create.todo({
      title: 'Second todo',
      description: 'Second description'
    });

    // Update both todos
    const updated1 = await client.todos.update.todo({
      id: createdTodoId,
      title: 'First updated'
    });

    const updated2 = await client.todos.update.todo({
      id: todo2.id,
      title: 'Second updated'
    });

    expect(updated1.id).toBe(createdTodoId);
    expect(updated1.title).toBe('First updated');
    expect(updated2.id).toBe(todo2.id);
    expect(updated2.title).toBe('Second updated');
  });
}); 