import type { TestUser } from '../../auth/member';
import type { BuilderCommand, ExecutionContext } from '../types';

export class RejectInvitation implements BuilderCommand {
  readonly priority = 33;
  private readonly user: TestUser;
  private readonly invitationId?: string;
  private readonly email?: string;

  constructor(user: TestUser, opts: { invitationId?: string; email?: string }) {
    this.user = user;
    this.invitationId = opts.invitationId;
    this.email = opts.email;
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    if (!ctx.organization) throw new Error('RejectInvitation requires an organization');
    await ctx.organization.rejectInvitationForUser(this.user, {
      invitationId: this.invitationId,
      email: this.email
    });
  }
}
