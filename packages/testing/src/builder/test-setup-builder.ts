import type { AccountStrategy } from '../auth/strategy';
import { CreateFounder } from './commands/create-founder';
import { CreateMember, type CreateMemberParams } from './commands/create-member';
import { CreateOrganization, type CreateOrganizationParams } from './commands/create-organization';
import type { BuilderCommand, ExecutionContext } from './types';

export interface BuilderOptions {
  registerForCleanup?: boolean;
}

export class TestSetupBuilder {
  private readonly commands: BuilderCommand[] = [];
  private readonly options: BuilderOptions;

  constructor(options?: BuilderOptions) {
    this.options = options ?? {};
  }

  withFounder(params?: { username?: string; strategy?: AccountStrategy }) {
    this.commands.push(new CreateFounder(params));
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

    return {
      founder: ctx.founder,
      organization: ctx.organization,
      members: ctx.members
    } as const;
  }
}
