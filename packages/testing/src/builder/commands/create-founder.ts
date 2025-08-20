import { TestUser } from '../../auth/member';
import type { AccountStrategy } from '../../auth/strategy';
import { MemberStrategy } from '../../auth/strategy';
import type { BuilderCommand, ExecutionContext } from '../types';

export class CreateFounder implements BuilderCommand {
  readonly priority = 10;
  private readonly username: string;
  private readonly strategy: AccountStrategy;

  constructor(params?: { username?: string; strategy?: AccountStrategy }) {
    this.username = params?.username ?? `founder_${Math.random().toString(36).slice(2, 8)}`;
    this.strategy = params?.strategy ?? new MemberStrategy();
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    if (ctx.founder) return;
    const founder = await TestUser.create(this.username, this.strategy, {
      registerForCleanup: ctx.registerForCleanup
    });
    ctx.founder = founder;
  }
}
