import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { TestSetupBuilder } from '@acme/testing';
import { emitNotification } from '../send';

describe('mark notifications as read - success cases', () => {
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

  test('marks all unread notifications as read', async () => {
    const userId = founder!.getId();

    // Create some unread notifications
    await emitNotification({
      userId,
      title: 'Unread notification 1',
      body: 'First unread notification',
      type: 'test'
    });

    await emitNotification({
      userId,
      title: 'Unread notification 2',
      body: 'Second unread notification',
      type: 'test'
    });

    // Verify they are unread initially
    const unreadBefore = await client.notifications.list.all({ isRead: false });
    expect(unreadBefore.length).toBeGreaterThanOrEqual(2);

    // Mark all as read
    const result = await client.notifications.markRead.batch({});

    expect(result.success).toBe(true);
    expect(result.updatedCount).toBeGreaterThanOrEqual(2);
    expect(result.readAt).toBeInstanceOf(Date);

    // Verify they are now read
    const unreadAfter = await client.notifications.list.all({ isRead: false });
    expect(unreadAfter.length).toBe(0);
  });

  test('marks notifications up to specific ID as read', async () => {
    const userId = founder!.getId();

    // Create notifications in sequence
    const _notification1 = await emitNotification({
      userId,
      title: 'Notification 1',
      body: 'First notification',
      type: 'test'
    });

    const notification2 = await emitNotification({
      userId,
      title: 'Notification 2',
      body: 'Second notification',
      type: 'test'
    });

    const _notification3 = await emitNotification({
      userId,
      title: 'Notification 3',
      body: 'Third notification',
      type: 'test'
    });

    // Mark up to notification2 as read
    const result = await client.notifications.markRead.batch({
      latestReadId: notification2
    });

    expect(result.success).toBe(true);
    expect(result.updatedCount).toBeGreaterThanOrEqual(2);

    // Verify only the first two are read
    const readNotifications = await client.notifications.list.all({ isRead: true });
    const unreadNotifications = await client.notifications.list.all({ isRead: false });

    expect(readNotifications.length).toBeGreaterThanOrEqual(2);
    expect(unreadNotifications.length).toBeGreaterThanOrEqual(1);
  });

  test('filters by type when marking as read', async () => {
    const userId = founder!.getId();

    // Create notifications with different types
    await emitNotification({
      userId,
      title: 'Test notification',
      body: 'Test notification',
      type: 'test'
    });

    await emitNotification({
      userId,
      title: 'Alert notification',
      body: 'Alert notification',
      type: 'alert'
    });

    // Mark only test notifications as read
    const result = await client.notifications.markRead.batch({ type: 'test' });

    expect(result.success).toBe(true);
    expect(result.updatedCount).toBeGreaterThanOrEqual(1);

    // Verify only test notifications are read
    const readTestNotifications = await client.notifications.list.all({
      isRead: true,
      type: 'test'
    });
    const unreadAlertNotifications = await client.notifications.list.all({
      isRead: false,
      type: 'alert'
    });

    expect(readTestNotifications.length).toBeGreaterThanOrEqual(1);
    expect(unreadAlertNotifications.length).toBeGreaterThanOrEqual(1);
  });

  test('filters by severity when marking as read', async () => {
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

    // Mark only info notifications as read
    const result = await client.notifications.markRead.batch({ severity: 'info' });

    expect(result.success).toBe(true);
    expect(result.updatedCount).toBeGreaterThanOrEqual(1);

    // Verify only info notifications are read
    const readInfoNotifications = await client.notifications.list.all({
      isRead: true,
      severity: 'info'
    });
    const unreadWarningNotifications = await client.notifications.list.all({
      isRead: false,
      severity: 'warning'
    });

    expect(readInfoNotifications.length).toBeGreaterThanOrEqual(1);
    expect(unreadWarningNotifications.length).toBeGreaterThanOrEqual(1);
  });

  test('combines filters when marking as read', async () => {
    const userId = founder!.getId();

    // Create notifications with different types and severities
    await emitNotification({
      userId,
      title: 'Test info notification',
      body: 'Test info notification',
      type: 'test',
      severity: 'info'
    });

    await emitNotification({
      userId,
      title: 'Test warning notification',
      body: 'Test warning notification',
      type: 'test',
      severity: 'warning'
    });

    await emitNotification({
      userId,
      title: 'Alert info notification',
      body: 'Alert info notification',
      type: 'alert',
      severity: 'info'
    });

    // Mark only test info notifications as read
    const result = await client.notifications.markRead.batch({
      type: 'test',
      severity: 'info'
    });

    expect(result.success).toBe(true);
    expect(result.updatedCount).toBeGreaterThanOrEqual(1);

    // Verify only test info notifications are read
    const readTestInfoNotifications = await client.notifications.list.all({
      isRead: true,
      type: 'test',
      severity: 'info'
    });
    const unreadTestWarningNotifications = await client.notifications.list.all({
      isRead: false,
      type: 'test',
      severity: 'warning'
    });

    expect(readTestInfoNotifications.length).toBeGreaterThanOrEqual(1);
    expect(unreadTestWarningNotifications.length).toBeGreaterThanOrEqual(1);
  });
});
