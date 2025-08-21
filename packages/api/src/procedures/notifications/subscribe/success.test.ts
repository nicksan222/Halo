import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('subscribe to notifications', () => {
  let builder: TestSetupBuilder;
  let client: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let founder: Awaited<ReturnType<import('@acme/testing').TestSetupBuilder['create']>>['founder'];

  beforeAll(async () => {
    builder = new TestSetupBuilder({ registerForCleanup: true }).withFounder({
      organization: { name: 'Test Org', slug: `test-org-${Math.random().toString(36).slice(2, 8)}` }
    });
    const created = await builder.create();
    founder = created.founder;
    client = await founder!.getApiClient();
  });

  afterAll(async () => {
    await builder.cleanup();
  });

  test('subscribes to notifications and receives them', async () => {
    const userId = founder!.getId();

    // Start the subscription FIRST and prepare to await the next event
    const asyncIterable = await client.notifications.subscribe.onNotification({ userId });
    const iterator = asyncIterable[Symbol.asyncIterator]();

    const nextEvent = (async () => {
      const { value, done } = await iterator.next();
      if (done) throw new Error('Subscription closed before any event');
      return value;
    })();

    // Fire the mutation that should emit a notification
    const input = { title: 'Write tests', description: 'Cover create mutation' };
    const todo = await client.todos.create.todo(input);

    // Wait for the first event (with timeout)
    const evt = await Promise.race([
      nextEvent,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timed out waiting for notification')), 5000)
      )
    ]);

    // Basic assertions — adjust if your payload differs
    expect(evt).toMatchObject({
      userId,
      title: 'New todo created',
      body: `New todo created: ${input.title}`,
      navigateTo: `/todos/${todo.id}`
    });
    expect(evt.metadata).toMatchObject({ todoId: todo.id });
  });
});
