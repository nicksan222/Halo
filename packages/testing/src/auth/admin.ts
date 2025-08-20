import { TestUser } from './member';
import { AdminStrategy } from './strategy';

/**
 * Convenience wrapper for creating an admin test account.
 */
export class TestAdmin extends TestUser {
  /**
   * Creates an admin test account.
   */
  static async create(username: string) {
    return TestUser.create(username, new AdminStrategy());
  }
}
