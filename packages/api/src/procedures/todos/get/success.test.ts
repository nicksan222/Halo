import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('get todo success', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let createdTodoId: string;

  beforeAll(async () => {
    builder = new TestSetupBuilder({ registerForCleanup: true }).withFounder({
      organization: { name: 'Test Org', slug: `test-org-${Math.random().toString(36).slice(2, 8)}` }
    });
    const { founder } = await builder.create();
    client = await founder!.getApiClient();

    // Create a todo to test with
    const todo = await client.todos.create.todo({
      title: 'Test todo for get',
      description: 'This todo will be retrieved'
    });
    createdTodoId = todo.id;
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('retrieves a todo by ID', async () => {
    const todo = await client.todos.get.byId({ id: createdTodoId });

    expect(todo.id).toBe(createdTodoId);
    expect(todo.title).toBe('Test todo for get');
    expect(todo.description).toBe('This todo will be retrieved');
    expect(todo.completed).toBe(false);
    expect(todo.userId).toBeDefined();
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.updatedAt).toBeInstanceOf(Date);
  });

  test('retrieves a completed todo by ID', async () => {
    // Create a completed todo
    const completedTodo = await client.todos.create.todo({
      title: 'Completed todo',
      description: 'This todo is completed'
    });

    // Mark it as completed
    await client.todos.update.todo({
      id: completedTodo.id,
      completed: true
    });

    // Retrieve it
    const retrievedTodo = await client.todos.get.byId({ id: completedTodo.id });

    expect(retrievedTodo.id).toBe(completedTodo.id);
    expect(retrievedTodo.title).toBe('Completed todo');
    expect(retrievedTodo.description).toBe('This todo is completed');
    expect(retrievedTodo.completed).toBe(true);
  });

  test('retrieves a todo with null description', async () => {
    const todoWithNullDesc = await client.todos.create.todo({
      title: 'Todo with null description'
    });

    const retrievedTodo = await client.todos.get.byId({ id: todoWithNullDesc.id });

    expect(retrievedTodo.id).toBe(todoWithNullDesc.id);
    expect(retrievedTodo.title).toBe('Todo with null description');
    expect(retrievedTodo.description).toBe(null);
  });

  test('retrieves a todo with special characters', async () => {
    const specialTodo = await client.todos.create.todo({
      title: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      description: 'Unicode: 🚀🌟🎉中文日本語한국어'
    });

    const retrievedTodo = await client.todos.get.byId({ id: specialTodo.id });

    expect(retrievedTodo.id).toBe(specialTodo.id);
    expect(retrievedTodo.title).toBe('Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?');
    expect(retrievedTodo.description).toBe('Unicode: 🚀🌟🎉中文日本語한국어');
  });

  test('retrieves multiple different todos correctly', async () => {
    const todo1 = await client.todos.create.todo({
      title: 'First todo',
      description: 'First description'
    });

    const todo2 = await client.todos.create.todo({
      title: 'Second todo',
      description: 'Second description'
    });

    const retrieved1 = await client.todos.get.byId({ id: todo1.id });
    const retrieved2 = await client.todos.get.byId({ id: todo2.id });

    expect(retrieved1.id).toBe(todo1.id);
    expect(retrieved1.title).toBe('First todo');
    expect(retrieved1.description).toBe('First description');

    expect(retrieved2.id).toBe(todo2.id);
    expect(retrieved2.title).toBe('Second todo');
    expect(retrieved2.description).toBe('Second description');

    // Ensure they are different todos
    expect(retrieved1.id).not.toBe(retrieved2.id);
  });
});
