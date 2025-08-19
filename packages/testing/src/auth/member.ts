import { appRouter, createContext } from '@acme/api';
import { auth, type User } from '@acme/auth';
import { registerTestUser } from './cleanup';
import { type AccountStrategy, MemberStrategy } from './strategy';

/**
 * High-level helper to provision and control lifecycle of a test user account.
 *
 * Usage:
 * - Create a regular member: `await TestUser.create('alice')`
 * - Create with a custom strategy (e.g., admin): `await TestUser.create('bob', new AdminStrategy())`
 */
export class TestUser {
  protected constructor(
    protected readonly user: User,
    protected readonly strategy: AccountStrategy
  ) {}

  /**
   * Creates a new test account using the provided strategy.
   * The default strategy provisions a regular member.
   */
  static async create(
    username: string,
    strategy: AccountStrategy = new MemberStrategy(),
    options?: { registerForCleanup?: boolean }
  ) {
    const password = strategy.getPassword();

    const user = await auth.api.createUser({
      body: {
        email: `${username}@test.com`,
        password,
        name: username,
        role: strategy.getRole()
      }
    });

    const instance = new TestUser(user.user, strategy);
    if (options?.registerForCleanup) registerTestUser(instance);
    return instance;
  }

  /**
   * Gets the user's email.
   */
  getEmail() {
    return this.user.email! as string;
  }

  /**
   * Returns headers with a valid session cookie for this user.
   */
  async getSessionHeaders() {
    const email = this.user.email!;

    const signIn = await auth.api.signInEmail({
      body: {
        email,
        password: this.strategy.getPassword(),
        rememberMe: true
      }
    });

    const headers = new Headers();
    const sessionToken = signIn.token;
    if (sessionToken) {
      headers.set('cookie', `better-auth.session_token=${sessionToken}`);
    }
    return headers;
  }

  /**
   * Deletes the underlying test account.
   */
  async delete() {
    await auth.api.deleteUser({
      params: {
        id: this.user.id
      },
      body: {
        callbackURL: undefined,
        password: undefined,
        token: undefined
      }
    });
  }

  /**
   * Returns a tRPC caller authenticated as this test account.
   */
  async getApiClient() {
    const headers = await this.getSessionHeaders();
    const ctx = await createContext({ headers });
    return appRouter.createCaller(ctx);
  }
}
