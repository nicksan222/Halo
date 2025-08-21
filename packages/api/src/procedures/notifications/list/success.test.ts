import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';
import { emitNotification } from '../send';

describe('list notifications - success cases', () => {
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

  test('lists notifications with pagination', async () => {
    const userId = founder!.getId();

    // Create some test notifications
    const _notification1 = await emitNotification({
      userId,
      title: 'Test notification 1',
      body: 'First test notification',
      type: 'test',
      severity: 'info'
    });

    const _notification2 = await emitNotification({
      userId,
      title: 'Test notification 2',
      body: 'Second test notification',
      type: 'test',
      severity: 'warning'
    });

    const _notification3 = await emitNotification({
      userId,
      title: 'Test notification 3',
      body: 'Third test notification',
      type: 'alert',
      severity: 'error'
    });

    // Test pagination
    const page1 = await client.notifications.list.all({ page: 1, limit: 2 });
    const page2 = await client.notifications.list.all({ page: 2, limit: 2 });

    expect(page1.length).toBe(2);
    expect(page2.length).toBe(1);

    // Should be ordered by createdAt desc (newest first)
    expect(page1[0].title).toBe('Test notification 3');
    expect(page1[1].title).toBe('Test notification 2');
    expect(page2[0].title).toBe('Test notification 1');
  });

  test('filters notifications by isRead status', async () => {
    const userId = founder!.getId();

    // Create unread notifications
    await emitNotification({
      userId,
      title: 'Unread notification',
      body: 'This should be unread',
      type: 'test'
    });

    // Get unread notifications
    const unreadNotifications = await client.notifications.list.all({ isRead: false });
    expect(unreadNotifications.length).toBeGreaterThan(0);
    expect(unreadNotifications.every((n) => !n.isRead)).toBe(true);

    // Get read notifications (should be empty initially)
    const readNotifications = await client.notifications.list.all({ isRead: true });
    expect(readNotifications.length).toBe(0);
  });

  test('filters notifications by type', async () => {
    const userId = founder!.getId();

    // Create notifications with different types
    await emitNotification({
      userId,
      title: 'Type test notification',
      body: 'Test notification',
      type: 'test'
    });

    await emitNotification({
      userId,
      title: 'Alert notification',
      body: 'Alert notification',
      type: 'alert'
    });

    // Filter by type
    const testNotifications = await client.notifications.list.all({ type: 'test' });
    const alertNotifications = await client.notifications.list.all({ type: 'alert' });

    expect(testNotifications.every((n) => n.type === 'test')).toBe(true);
    expect(alertNotifications.every((n) => n.type === 'alert')).toBe(true);
  });

  test('filters notifications by severity', async () => {
    const userId = founder!.getId();

    // Create notifications with different severities
    await emitNotification({
      userId,
      title: 'Info notification',
      body: 'Info notification',
      severity: 'info'
    });

    await emitNotification({
      userId,
      title: 'Warning notification',
      body: 'Warning notification',
      severity: 'warning'
    });

    // Filter by severity
    const infoNotifications = await client.notifications.list.all({ severity: 'info' });
    const warningNotifications = await client.notifications.list.all({ severity: 'warning' });

    expect(infoNotifications.every((n) => n.severity === 'info')).toBe(true);
    expect(warningNotifications.every((n) => n.severity === 'warning')).toBe(true);
  });

  test('parses metadata correctly', async () => {
    const userId = founder!.getId();

    const metadata = { todoId: 'test-123', action: 'created' };
    await emitNotification({
      userId,
      title: 'Notification with metadata',
      body: 'Test notification',
      metadata
    });

    const notifications = await client.notifications.list.all({ limit: 1 });
    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].metadata).toEqual(metadata);
  });
});
