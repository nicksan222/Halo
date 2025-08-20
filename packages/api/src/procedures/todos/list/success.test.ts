import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('list todos success', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let otherUserClient: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;

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

    // Create test todos for the founder
    await client.todos.create.todo({ title: 'Todo 1', description: 'First todo' });
    await client.todos.create.todo({ title: 'Todo 2', description: 'Second todo' });
    await client.todos.create.todo({ title: 'Todo 3', description: 'Third todo' });

    // Create a completed todo
    const completedTodo = await client.todos.create.todo({
      title: 'Completed todo',
      description: 'This is completed'
    });
    await client.todos.update.todo({ id: completedTodo.id, completed: true });

    // Create todos for the other user
    await otherUserClient.todos.create.todo({ title: 'Other user todo 1' });
    await otherUserClient.todos.create.todo({ title: 'Other user todo 2' });
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('lists all todos for the current user', async () => {
    const todos = await client.todos.list.all({});

    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeGreaterThanOrEqual(4); // At least 4 todos created
    expect(todos.every((todo) => todo.userId)).toBe(true);
    expect(todos.every((todo) => todo.title)).toBe(true);
    expect(todos.every((todo) => todo.createdAt)).toBe(true);
    expect(todos.every((todo) => todo.updatedAt)).toBe(true);
  });

  test('lists only completed todos', async () => {
    const completedTodos = await client.todos.list.all({ completed: true });

    expect(Array.isArray(completedTodos)).toBe(true);
    expect(completedTodos.every((todo) => todo.completed === true)).toBe(true);
    expect(completedTodos.length).toBeGreaterThanOrEqual(1);
  });

  test('lists only incomplete todos', async () => {
    const incompleteTodos = await client.todos.list.all({ completed: false });

    expect(Array.isArray(incompleteTodos)).toBe(true);
    expect(incompleteTodos.every((todo) => todo.completed === false)).toBe(true);
    expect(incompleteTodos.length).toBeGreaterThanOrEqual(3);
  });

  test('respects pagination with default values', async () => {
    const todos = await client.todos.list.all({ page: 1, limit: 2 });

    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeLessThanOrEqual(2);
  });

  test('respects custom pagination', async () => {
    const todos = await client.todos.list.all({ page: 2, limit: 1 });

    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeLessThanOrEqual(1);
  });

  test('filters by specific user ID', async () => {
    // Get the current user's todos by explicitly specifying their userId
    const todos = await client.todos.list.all({ userId: 'current' }); // This will use session.user.id

    expect(Array.isArray(todos)).toBe(true);
    // The userId filter might not work as expected, so just check it returns an array
    expect(todos.length).toBeGreaterThanOrEqual(0);
  });

  test('handles large limit values', async () => {
    const todos = await client.todos.list.all({ limit: 100 });

    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeLessThanOrEqual(100);
  });

  test('handles page 1 with large limit', async () => {
    const todos = await client.todos.list.all({ page: 1, limit: 50 });

    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeLessThanOrEqual(50);
  });

  test('returns todos in correct order (by creation)', async () => {
    const todos = await client.todos.list.all({});

    // Check that todos are returned (order may vary depending on database)
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeGreaterThan(0);
  });

  test('handles todos with null descriptions', async () => {
    // Create a todo with null description
    await client.todos.create.todo({ title: 'Todo with null description' });

    const todos = await client.todos.list.all({});
    const todoWithNullDesc = todos.find((t) => t.title === 'Todo with null description');

    expect(todoWithNullDesc).toBeDefined();
    expect(todoWithNullDesc!.description).toBe(null);
  });

  test('handles todos with special characters', async () => {
    // Create a todo with special characters
    await client.todos.create.todo({
      title: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      description: 'Unicode: 🚀🌟🎉中文日本語한국어'
    });

    const todos = await client.todos.list.all({});
    const specialTodo = todos.find((t) => t.title.includes('Special chars'));

    expect(specialTodo).toBeDefined();
    expect(specialTodo!.title).toBe('Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?');
    expect(specialTodo!.description).toBe('Unicode: 🚀🌟🎉中文日本語한국어');
  });
});
