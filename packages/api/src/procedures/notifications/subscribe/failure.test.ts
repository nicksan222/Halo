import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';

describe('subscribe to notifications - failure cases', () => {
  let builder1: TestSetupBuilder;
  let builder2: TestSetupBuilder;
  let client1: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let client2: Awaited<ReturnType<import('@acme/testing').TestUser['getApiClient']>>;
  let founder1: Awaited<ReturnType<import('@acme/testing').TestSetupBuilder['create']>>['founder'];
  let founder2: Awaited<ReturnType<import('@acme/testing').TestSetupBuilder['create']>>['founder'];

  beforeAll(async () => {
    // Create two separate organizations
    builder1 = new TestSetupBuilder({ registerForCleanup: true }).withFounder({
      organization: {
        name: 'Test Org 1',
        slug: `test-org-1-${Math.random().toString(36).slice(2, 8)}`
      }
    });
    builder2 = new TestSetupBuilder({ registerForCleanup: true }).withFounder({
      organization: {
        name: 'Test Org 2',
        slug: `test-org-2-${Math.random().toString(36).slice(2, 8)}`
      }
    });

    const created1 = await builder1.create();
    const created2 = await builder2.create();

    founder1 = created1.founder;
    founder2 = created2.founder;

    client1 = await founder1!.getApiClient();
    client2 = await founder2!.getApiClient();
  });

  afterAll(async () => {
    await builder1.cleanup();
    await builder2.cleanup();
  });

  test('user from different organization does not receive notifications meant for another user', async () => {
    const userId1 = founder1!.getId();
    const userId2 = founder2!.getId();

    // Start subscriptions for both users
    const asyncIterable1 = await client1.notifications.subscribe.onNotification({
      userId: userId1
    });
    const asyncIterable2 = await client2.notifications.subscribe.onNotification({
      userId: userId2
    });

    const iterator1 = asyncIterable1[Symbol.asyncIterator]();
    const iterator2 = asyncIterable2[Symbol.asyncIterator]();

    // Prepare to await events for both users
    const nextEvent1 = (async () => {
      const { value, done } = await iterator1.next();
      if (done) throw new Error('Subscription 1 closed before any event');
      return value;
    })();

    const nextEvent2 = (async () => {
      const { value, done } = await iterator2.next();
      if (done) throw new Error('Subscription 2 closed before any event');
      return value;
    })();

    // Fire the mutation that should emit a notification for user1 only
    const input = { title: 'Write tests', description: 'Cover create mutation' };
    const todo = await client1.todos.create.todo(input);

    // Wait for the event for user1 (should succeed)
    const evt1 = await Promise.race([
      nextEvent1,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timed out waiting for notification for user1')), 5000)
      )
    ]);

    // Verify user1 received the notification
    expect(evt1).toMatchObject({
      userId: userId1,
      title: 'New todo created',
      body: `New todo created: ${input.title}`,
      navigateTo: `/todos/${todo.id}`
    });
    expect(evt1.metadata).toMatchObject({ todoId: todo.id });

    // Verify user2 does NOT receive the notification
    // We expect this to timeout since user2 shouldn't receive notifications meant for user1
    const user2ReceivedEvent = await Promise.race([
      nextEvent2,
      new Promise<null>(
        (resolve) => setTimeout(() => resolve(null), 2000) // Shorter timeout for failure case
      )
    ]);

    // If user2 received an event, that's a failure
    expect(user2ReceivedEvent).toBeNull();
  });

  test('user without userId filter receives all notifications', async () => {
    const userId1 = founder1!.getId();

    // Start subscription without userId filter (should receive all notifications)
    const asyncIterable = await client1.notifications.subscribe.onNotification({});
    const iterator = asyncIterable[Symbol.asyncIterator]();

    const nextEvent = (async () => {
      const { value, done } = await iterator.next();
      if (done) throw new Error('Subscription closed before any event');
      return value;
    })();

    // Fire the mutation that should emit a notification
    const input = { title: 'Another todo', description: 'Test unfiltered subscription' };
    const todo = await client1.todos.create.todo(input);

    // Wait for the event (should succeed since no userId filter)
    const evt = await Promise.race([
      nextEvent,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timed out waiting for notification')), 5000)
      )
    ]);

    // Verify the notification was received
    expect(evt).toMatchObject({
      userId: userId1,
      title: 'New todo created',
      body: `New todo created: ${input.title}`,
      navigateTo: `/todos/${todo.id}`
    });
    expect(evt.metadata).toMatchObject({ todoId: todo.id });
  });
});
