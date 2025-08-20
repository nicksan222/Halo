import type { BuilderCommand, ExecutionContext } from '../types';

export class CancelInvitation implements BuilderCommand {
  readonly priority = 32;
  private readonly invitationId: string;

  constructor(invitationId: string) {
    this.invitationId = invitationId;
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    if (!ctx.organization) throw new Error('CancelInvitation requires an organization');
    await ctx.organization.cancelInvitation(this.invitationId);
  }
}
