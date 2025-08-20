import { UserRole } from '@acme/auth';

/**
 * Strategy used to parameterize how test accounts are created and authenticated.
 */
export interface AccountStrategy {
  /**
   * The role assigned to the created user.
   */
  getRole(): UserRole;
  /**
   * The password used when creating and signing in the test account.
   * Defaults to 'test1234'.
   */
  getPassword(): string;
}

/**
 * Default strategy for a regular member user.
 */
export class MemberStrategy implements AccountStrategy {
  getRole(): UserRole {
    return UserRole.User;
  }
  getPassword(): string {
    return 'test1234';
  }
}

/**
 * Strategy for an admin user.
 */
export class AdminStrategy implements AccountStrategy {
  getRole(): UserRole {
    return UserRole.Admin;
  }
  getPassword(): string {
    return 'test1234';
  }
}
