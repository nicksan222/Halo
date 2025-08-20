import type { OrganizationRole as OrgRole } from '@acme/auth';
import { TestUser } from '../../auth/member';
import type { BuilderCommand, ExecutionContext } from '../types';

export interface CreateMemberParams {
  username?: string;
  role?: OrgRole | OrgRole[];
}

export class CreateMember implements BuilderCommand {
  readonly priority = 30;
  private readonly username: string;
  private readonly role?: OrgRole | OrgRole[];

  constructor(params?: CreateMemberParams) {
    this.username = params?.username ?? `member_${Math.random().toString(36).slice(2, 8)}`;
    this.role = params?.role;
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    if (!ctx.organization)
      throw new Error('CreateMember requires an organization to be created first');

    const user = await TestUser.create(this.username, undefined, {
      registerForCleanup: ctx.registerForCleanup
    });
    await ctx.organization.addMember(user, { role: this.role });
    ctx.members.push(user);
  }
}
