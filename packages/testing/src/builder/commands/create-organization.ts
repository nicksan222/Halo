import { TestOrganization } from '../../auth/organization';
import type { BuilderCommand, ExecutionContext } from '../types';

export interface CreateOrganizationParams {
  name: string;
  slug: string;
  logo?: string;
  metadata?: Record<string, unknown>;
  keepCurrentActiveOrganization?: boolean;
}

export class CreateOrganization implements BuilderCommand {
  readonly priority = 20;
  private readonly args: CreateOrganizationParams;

  constructor(args: CreateOrganizationParams) {
    this.args = args;
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    if (ctx.organization) return;
    if (!ctx.founder) throw new Error('CreateOrganization requires a founder to be created first');

    const org = await TestOrganization.create(ctx.founder, this.args, {
      registerForCleanup: ctx.registerForCleanup
    });
    ctx.organization = org;
  }
}
