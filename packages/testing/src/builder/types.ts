import type { TestUser } from '../auth/member';
import type { TestOrganization } from '../auth/organization';

/**
 * Execution context shared across builder commands.
 */
export interface ExecutionContext {
  founder?: TestUser;
  organization?: TestOrganization;
  members: TestUser[];
  registerForCleanup: boolean;
}

/**
 * Strategy interface for a builder command.
 */
export interface BuilderCommand {
  /**
   * Lower numbers run earlier.
   */
  readonly priority: number;
  execute(ctx: ExecutionContext): Promise<void>;
}
