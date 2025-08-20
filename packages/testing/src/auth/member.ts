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

    const signInResponse = await auth.api.signInEmail({
      body: {
        email,
        password: this.strategy.getPassword(),
        rememberMe: true
      },
      asResponse: true
    });

    const headers = new Headers();

    // Extract the signed session cookie from Set-Cookie
    const setCookieHeader = signInResponse.headers.get('set-cookie') ?? '';
    const cookieMatch = setCookieHeader.match(
      /(?:^|,\s*)(?:(__Secure-)?better-auth\.session_token)=([^;]+)/
    );

    if (cookieMatch) {
      const cookieName = cookieMatch[1]
        ? `${cookieMatch[1]}better-auth.session_token`
        : 'better-auth.session_token';
      const cookieValue = cookieMatch[2];
      const cookiePair = `${cookieName}=${cookieValue}`;
      headers.set('cookie', cookiePair);
    }

    return headers;
  }

  /**
   * Deletes the underlying test account.
   */
  async delete() {
    try {
      const headers = await this.getSessionHeaders();
      await auth.api.deleteUser({
        params: {
          id: this.user.id
        },
        body: {
          callbackURL: undefined,
          password: undefined,
          token: undefined
        },
        headers
      });
    } catch {
      // Ignore cleanup errors (e.g., disabled delete, 401/404)
      return;
    }
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
