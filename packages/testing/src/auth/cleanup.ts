import type { TestUser } from './member';
import type { TestOrganization } from './organization';

/**
 * Registry to track created test resources for post-test cleanup.
 */
const registeredUsers: TestUser[] = [];
const registeredOrganizations: TestOrganization[] = [];

/**
 * Register a test user for cleanup.
 */
export function registerTestUser(user: TestUser) {
  registeredUsers.push(user);
}

/**
 * Register a test organization for cleanup.
 */
export function registerTestOrganization(org: TestOrganization) {
  registeredOrganizations.push(org);
}

/**
 * Unregister all tracked resources without deleting them.
 */
export function clearRegistry() {
  registeredUsers.length = 0;
  registeredOrganizations.length = 0;
}

/**
 * Deletes all registered organizations. Runs deletions in parallel and ignores individual failures.
 */
export async function cleanupOrganizations() {
  const toDelete = registeredOrganizations.splice(0, registeredOrganizations.length);
  await Promise.allSettled(toDelete.map((o) => o.delete()));
}

/**
 * Deletes all registered users. Runs deletions in parallel and ignores individual failures.
 */
export async function cleanupUsers() {
  const toDelete = registeredUsers.splice(0, registeredUsers.length);
  await Promise.allSettled(toDelete.map((u) => u.delete()));
}

/**
 * Deletes all registered organizations first, then all registered users.
 */
export async function cleanupAll() {
  await cleanupOrganizations();
  await cleanupUsers();
}
