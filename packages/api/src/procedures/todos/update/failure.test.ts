import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('update todo failure', () => {
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
      title: 'Test todo for update failure tests',
      description: 'This todo will be used for failure tests'
    });
    createdTodoId = todo.id;
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('fails with empty ID', async () => {
    await expect(
      client.todos.update.todo({
        id: '',
        title: 'Updated title'
      })
    ).rejects.toThrow();
  });

  test('fails with whitespace-only ID', async () => {
    await expect(
      client.todos.update.todo({
        id: '   ',
        title: 'Updated title'
      })
    ).rejects.toThrow();
  });

  test('fails with missing ID', async () => {
    await expect(
      client.todos.update.todo({
        title: 'Updated title'
      } as any)
    ).rejects.toThrow();
  });

  test('fails with null ID', async () => {
    await expect(
      client.todos.update.todo({
        id: null,
        title: 'Updated title'
      } as any)
    ).rejects.toThrow();
  });

  test('fails with undefined ID', async () => {
    await expect(
      client.todos.update.todo({
        id: undefined,
        title: 'Updated title'
      } as any)
    ).rejects.toThrow();
  });

  test('fails with non-string ID', async () => {
    await expect(
      client.todos.update.todo({
        id: 123,
        title: 'Updated title'
      } as any)
    ).rejects.toThrow();
  });

  test('fails with non-existent ID', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';

    await expect(
      client.todos.update.todo({
        id: nonExistentId,
        title: 'Updated title'
      })
    ).rejects.toThrow('Todo not found');
  });

  test('fails with malformed UUID', async () => {
    const malformedId = 'not-a-valid-uuid';

    await expect(
      client.todos.update.todo({
        id: malformedId,
        title: 'Updated title'
      })
    ).rejects.toThrow('Todo not found');
  });

  test("fails when updating another user's todo", async () => {
    // Try to update the todo created by the founder from the member's client
    await expect(
      otherUserClient.todos.update.todo({
        id: createdTodoId,
        title: 'Updated by other user'
      })
    ).rejects.toThrow('Todo not found');
  });

  test('fails with empty title', async () => {
    await expect(
      client.todos.update.todo({
        id: createdTodoId,
        title: ''
      })
    ).rejects.toThrow();
  });

  test('succeeds with whitespace-only title', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      title: '   '
    });

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBe('   ');
  });

  test('fails with null title', async () => {
    await expect(
      client.todos.update.todo({
        id: createdTodoId,
        title: null
      } as any)
    ).rejects.toThrow();
  });

  test('succeeds with undefined title (keeps existing title)', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      title: undefined
    } as any);

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBeDefined();
  });

  test('fails with non-string title', async () => {
    await expect(
      client.todos.update.todo({
        id: createdTodoId,
        title: 123
      } as any)
    ).rejects.toThrow();
  });

  test('fails with non-string description', async () => {
    await expect(
      client.todos.update.todo({
        id: createdTodoId,
        description: 123
      } as any)
    ).rejects.toThrow();
  });

  test('fails with non-boolean completed', async () => {
    await expect(
      client.todos.update.todo({
        id: createdTodoId,
        completed: 'true'
      } as any)
    ).rejects.toThrow();
  });

  test('fails with very long ID', async () => {
    const longId = 'A'.repeat(1000);

    await expect(
      client.todos.update.todo({
        id: longId,
        title: 'Updated title'
      })
    ).rejects.toThrow('Todo not found');
  });

  test('fails with special characters in ID', async () => {
    const specialId = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    await expect(
      client.todos.update.todo({
        id: specialId,
        title: 'Updated title'
      })
    ).rejects.toThrow('Todo not found');
  });

  test('fails with unicode characters in ID', async () => {
    const unicodeId = '🚀🌟🎉中文日本語한국어';

    await expect(
      client.todos.update.todo({
        id: unicodeId,
        title: 'Updated title'
      })
    ).rejects.toThrow('Todo not found');
  });

  test('fails when todo is deleted', async () => {
    // Create a todo
    const todoToDelete = await client.todos.create.todo({
      title: 'Todo to be deleted',
      description: 'This todo will be deleted'
    });

    // Delete it
    await client.todos.delete.todo({ id: todoToDelete.id });

    // Try to update it
    await expect(
      client.todos.update.todo({
        id: todoToDelete.id,
        title: 'Updated after deletion'
      })
    ).rejects.toThrow('Todo not found');
  });

  test('fails with completely invalid input', async () => {
    await expect(client.todos.update.todo('not an object' as any)).rejects.toThrow();
  });

  test('fails with null input', async () => {
    await expect(client.todos.update.todo(null as any)).rejects.toThrow();
  });

  test('fails with undefined input', async () => {
    await expect(client.todos.update.todo(undefined as any)).rejects.toThrow();
  });

  test('succeeds with malformed input object (ignores extra fields)', async () => {
    const updatedTodo = await client.todos.update.todo({
      id: createdTodoId,
      invalidField: 'value'
    } as any);

    expect(updatedTodo.id).toBe(createdTodoId);
    expect(updatedTodo.title).toBeDefined();
  });
});
