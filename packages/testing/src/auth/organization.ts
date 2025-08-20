import { auth, OrganizationRole as OrgRole } from '@acme/auth';
import { registerTestOrganization } from './cleanup';
import type { TestUser } from './member';

export type OrganizationId = string;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractOrganizationIdFromGetFull(res: unknown): string | undefined {
  if (isObject(res) && isObject(res.organization) && typeof res.organization.id === 'string')
    return res.organization.id;
  if (isObject(res) && isObject((res as Record<string, unknown>).data)) {
    const data = (res as Record<string, unknown>).data as Record<string, unknown>;
    if (
      isObject(data.organization) &&
      typeof (data.organization as Record<string, unknown>).id === 'string'
    ) {
      return (data.organization as Record<string, unknown>).id as string;
    }
  }
  if (isObject(res) && typeof (res as Record<string, unknown>).id === 'string')
    return (res as Record<string, unknown>).id as string;
  return undefined;
}

function extractInvitations(res: unknown): { id: string; email: string }[] {
  const candidates: unknown = ((): unknown => {
    if (Array.isArray(res)) return res;
    if (isObject(res) && Array.isArray((res as Record<string, unknown>).invitations))
      return (res as Record<string, unknown>).invitations as unknown[];
    if (isObject(res) && Array.isArray((res as Record<string, unknown>).data))
      return (res as Record<string, unknown>).data as unknown[];
    return [] as unknown[];
  })();
  if (!Array.isArray(candidates)) return [];
  return candidates
    .filter(
      (i: unknown): i is { id: string; email: string } =>
        isObject(i) && typeof i.id === 'string' && typeof i.email === 'string'
    )
    .map((i) => ({ id: i.id, email: i.email }));
}

type InviteMemberFn = (args: {
  body: {
    organizationId: string;
    email: string;
    role: OrgRole | OrgRole[];
    teamId?: string;
    resend?: boolean;
  };
  headers: Headers;
}) => Promise<unknown>;

function hasInviteMember(api: unknown): api is { inviteMember: InviteMemberFn } {
  return (
    isObject(api) &&
    'inviteMember' in api &&
    typeof (api as { inviteMember: unknown }).inviteMember === 'function'
  );
}

/**
 * Testing helper for Better Auth organizations.
 *
 * Provides utilities to create an organization, invite/add members, list and remove members, manage invitations,
 * update member roles, and set the active organization for the owner.
 */
export class TestOrganization {
  constructor(
    private readonly owner: TestUser,
    public readonly id: OrganizationId
  ) {}

  /**
   * Creates an organization using the given owner account.
   */
  static async create(
    owner: TestUser,
    args: {
      name: string;
      slug: string;
      logo?: string;
      metadata?: Record<string, unknown>;
      keepCurrentActiveOrganization?: boolean;
    },
    options?: { registerForCleanup?: boolean }
  ) {
    const headers = await owner.getSessionHeaders();

    await auth.api.createOrganization({
      body: {
        name: args.name,
        slug: args.slug,
        logo: args.logo,
        metadata: args.metadata,
        keepCurrentActiveOrganization: args.keepCurrentActiveOrganization ?? false
      },
      headers
    });

    const full = await auth.api.getFullOrganization({
      query: { organizationSlug: args.slug },
      headers
    });
    const organizationId = extractOrganizationIdFromGetFull(full);
    if (!organizationId) throw new Error('Failed to resolve organization id after creation');
    const instance = new TestOrganization(owner, organizationId);
    if (options?.registerForCleanup) registerTestOrganization(instance);
    return instance;
  }

  /**
   * Updates organization info.
   */
  async update(data: {
    name?: string;
    slug?: string;
    logo?: string;
    metadata?: Record<string, any>;
  }) {
    const headers = await this.owner.getSessionHeaders();
    await auth.api.updateOrganization({
      body: {
        organizationId: this.id,
        data
      },
      headers
    });
  }

  /**
   * Deletes the organization. Owner must have permission (typically creator/owner).
   */
  async delete() {
    const headers = await this.owner.getSessionHeaders();
    await auth.api.deleteOrganization({
      body: { organizationId: this.id },
      headers
    });
  }

  /**
   * Sets this organization as active for the owner's session.
   */
  async setActive() {
    const headers = await this.owner.getSessionHeaders();
    await auth.api.setActiveOrganization({
      body: { organizationId: this.id },
      headers
    });
  }

  /**
   * Lists members in this organization.
   */
  async listMembers(params?: { limit?: number; offset?: number }) {
    const headers = await this.owner.getSessionHeaders();
    return auth.api.listMembers({
      query: {
        organizationId: this.id,
        limit: params?.limit,
        offset: params?.offset
      },
      headers
    });
  }

  /**
   * Removes a member by member id or email.
   */
  async removeMember(memberIdOrEmail: string) {
    const headers = await this.owner.getSessionHeaders();
    await auth.api.removeMember({
      body: {
        organizationId: this.id,
        memberIdOrEmail
      },
      headers
    });
  }

  /**
   * Updates the role(s) for a member.
   */
  async updateMemberRole(memberId: string, role: OrgRole | OrgRole[]) {
    const headers = await this.owner.getSessionHeaders();
    await auth.api.updateMemberRole({
      body: {
        organizationId: this.id,
        memberId,
        role
      },
      headers
    });
  }

  /**
   * Lists invitations for this organization.
   */
  async listInvitations() {
    const headers = await this.owner.getSessionHeaders();
    return auth.api.listInvitations({
      query: { organizationId: this.id },
      headers
    });
  }

  /**
   * Finds the latest invitation id for an email in this organization.
   */
  async getInvitationIdForEmail(email: string) {
    const res = await this.listInvitations();
    const invitations = extractInvitations(res);
    const match = invitations.find((i) => i.email === email);
    return match?.id;
  }

  /**
   * Invites an email to this organization.
   */
  async inviteMember(
    email: string,
    opts?: { role?: OrgRole | OrgRole[]; teamId?: string; resend?: boolean }
  ) {
    const headers = await this.owner.getSessionHeaders();
    if (!hasInviteMember(auth.api))
      throw new Error('inviteMember endpoint not available on auth.api');
    await auth.api.inviteMember({
      body: {
        organizationId: this.id,
        email,
        role: opts?.role ?? OrgRole.Member,
        teamId: opts?.teamId,
        resend: opts?.resend
      },
      headers
    });
  }

  /**
   * Cancels an invitation by id.
   */
  async cancelInvitation(invitationId: string) {
    const headers = await this.owner.getSessionHeaders();
    await auth.api.cancelInvitation({
      body: { invitationId },
      headers
    });
  }

  /**
   * Rejects an invitation as the specified user. If invitationId is not provided, it will be resolved using email.
   */
  async rejectInvitationForUser(user: TestUser, opts: { invitationId?: string; email?: string }) {
    const headers = await user.getSessionHeaders();
    let invitationId = opts.invitationId;
    if (!invitationId && opts.email) {
      invitationId = await this.getInvitationIdForEmail(opts.email);
    }
    if (!invitationId) throw new Error('Invitation id required to reject invitation');
    await auth.api.rejectInvitation({
      body: { invitationId },
      headers
    });
  }

  /**
   * Adds a user as a member by sending an invitation and auto-accepting it on the user's session.
   */
  async addMember(
    user: TestUser,
    opts?: { role?: OrgRole | OrgRole[]; teamId?: string; resend?: boolean }
  ) {
    const email = user.getEmail();
    await this.inviteMember(email, opts);
    const invitationId = await this.getInvitationIdForEmail(email);
    if (!invitationId) throw new Error('Invitation not found after inviting member');

    const headers = await user.getSessionHeaders();
    await auth.api.acceptInvitation({
      body: { invitationId },
      headers
    });
  }
}
