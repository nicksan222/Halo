import type { OrganizationRole as OrgRole } from '@acme/auth';
import type { BuilderCommand, ExecutionContext } from '../types';

export class UpdateMemberRole implements BuilderCommand {
  readonly priority = 35;
  private readonly memberId: string;
  private readonly role: OrgRole | OrgRole[];

  constructor(memberId: string, role: OrgRole | OrgRole[]) {
    this.memberId = memberId;
    this.role = role;
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    if (!ctx.organization) throw new Error('UpdateMemberRole requires an organization');
    await ctx.organization.updateMemberRole(this.memberId, this.role);
  }
}
