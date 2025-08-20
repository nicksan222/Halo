import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('create todo success', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;

  beforeAll(async () => {
    builder = new TestSetupBuilder({ registerForCleanup: true }).withFounder();
    const { founder } = await builder.create();
    client = await founder!.getApiClient();
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('creates a todo with correct defaults and ownership', async () => {
    const input = { title: 'Write tests', description: 'Cover create mutation' };

    const todo = await client.todos.create.todo(input);

    expect(todo.id).toBeDefined();
    expect(typeof todo.id).toBe('string');
    expect(todo.title).toBe(input.title);
    expect(todo.description).toBe(input.description);
    expect(todo.completed).toBe(false);
    expect(todo.userId).toBeDefined();
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.updatedAt).toBeInstanceOf(Date);

    const list = await client.todos.list.all({});
    expect(Array.isArray(list)).toBe(true);
    expect(list.find((t) => t.id === todo.id)).toBeTruthy();
  });
});
