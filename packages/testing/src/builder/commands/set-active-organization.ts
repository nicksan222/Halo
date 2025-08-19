import type { BuilderCommand, ExecutionContext } from '../types';

export class SetActiveOrganization implements BuilderCommand {
  readonly priority = 22;

  async execute(ctx: ExecutionContext): Promise<void> {
    if (!ctx.organization) throw new Error('SetActiveOrganization requires an organization');
    await ctx.organization.setActive();
  }
}
