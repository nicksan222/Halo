import type { BuilderCommand, ExecutionContext } from '../types';

export class RemoveMember implements BuilderCommand {
  readonly priority = 40;
  private readonly memberIdOrEmail: string;

  constructor(memberIdOrEmail: string) {
    this.memberIdOrEmail = memberIdOrEmail;
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    if (!ctx.organization) throw new Error('RemoveMember requires an organization');
    await ctx.organization.removeMember(this.memberIdOrEmail);
  }
}
