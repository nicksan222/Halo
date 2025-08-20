import type { TestUser } from '../auth/member';
import type { TestOrganization } from '../auth/organization';
import type { AccountStrategy } from '../auth/strategy';
import { CreateFounder } from './commands/create-founder';
import { CreateMember, type CreateMemberParams } from './commands/create-member';
import { CreateOrganization, type CreateOrganizationParams } from './commands/create-organization';
import type { BuilderCommand, ExecutionContext } from './types';

export interface BuilderOptions {
  registerForCleanup?: boolean;
}

export interface CreatedResources {
  founder?: TestUser;
  organization?: TestOrganization;
  members: TestUser[];
}

export class TestSetupBuilder {
  private readonly commands: BuilderCommand[] = [];
  private readonly options: BuilderOptions;
  private createdResources: CreatedResources | null = null;

  constructor(options?: BuilderOptions) {
    this.options = options ?? {};
  }

  withFounder(params: {
    username?: string;
    strategy?: AccountStrategy;
    organization: CreateOrganizationParams;
  }) {
    const { username, strategy, organization } = params;
    this.commands.push(new CreateFounder({ username, strategy }));
    this.commands.push(new CreateOrganization(organization));
    return this;
  }

  withOrganization(args: CreateOrganizationParams) {
    this.commands.push(new CreateOrganization(args));
    return this;
  }

  withMember(params?: CreateMemberParams) {
    this.commands.push(new CreateMember(params));
    return this;
  }

  /**
   * Executes all enqueued commands by priority and returns created resources.
   */
  async create() {
    const ctx: ExecutionContext = {
      founder: undefined,
      organization: undefined,
      members: [],
      registerForCleanup: this.options.registerForCleanup ?? false
    };

    const ordered = [...this.commands].sort((a, b) => a.priority - b.priority);
    for (const cmd of ordered) {
      await cmd.execute(ctx);
    }

    this.createdResources = {
      founder: ctx.founder,
      organization: ctx.organization,
      members: ctx.members
    };

    return this.createdResources;
  }

  /**
   * Cleans up all resources created by this builder.
   * Deletes members first, then organization, then founder.
   */
  async cleanup() {
    if (!this.createdResources) {
      return;
    }

    const { founder, organization, members } = this.createdResources;

    // Clean up members first
    if (members.length > 0) {
      await Promise.allSettled(
        members.map(async (member) => {
          if (organization) {
            try {
              await organization.removeMember(member.getEmail());
            } catch (err: any) {
              if (!(err?.statusCode === 401 || err?.status === 'UNAUTHORIZED')) throw err;
            }
          }
          try {
            await member.delete();
          } catch (err: any) {
            if (!(err?.statusCode === 401 || err?.status === 'UNAUTHORIZED')) throw err;
          }
        })
      );
    }

    // Clean up organization
    if (organization) {
      try {
        await organization.delete();
      } catch (err: any) {
        if (!(err?.statusCode === 401 || err?.status === 'UNAUTHORIZED')) throw err;
      }
    }

    // Clean up founder
    if (founder) {
      try {
        await founder.delete();
      } catch (err: any) {
        if (!(err?.statusCode === 401 || err?.status === 'UNAUTHORIZED')) throw err;
      }
    }

    // Clear the created resources
    this.createdResources = null;
  }

  /**
   * Gets the currently created resources (if any).
   */
  getCreatedResources(): CreatedResources | null {
    return this.createdResources;
  }
}
