import type { BuilderCommand, ExecutionContext } from '../types';

export interface UpdateOrganizationParams {
  data: { name?: string; slug?: string; metadata?: Record<string, any> };
}

export class UpdateOrganization implements BuilderCommand {
  readonly priority = 25;
  private readonly params: UpdateOrganizationParams;

  constructor(params: UpdateOrganizationParams) {
    this.params = params;
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    if (!ctx.organization) throw new Error('UpdateOrganization requires an organization');
    await ctx.organization.update(this.params.data);
  }
}
