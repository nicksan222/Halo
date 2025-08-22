import { auth, OrganizationRole as OrgRole } from '@acme/auth';
import { registerTestOrganization } from './cleanup';
import type { TestUser } from './member';

export type OrganizationId = string;

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
        metadata: args.metadata,
        keepCurrentActiveOrganization: args.keepCurrentActiveOrganization ?? false
      },
      headers
    });

    const full = await auth.api.getFullOrganization({
      query: { organizationSlug: args.slug },
      headers
    });
    const organizationId = full?.id;
    if (!organizationId) throw new Error('Failed to resolve organization id after creation');
    const instance = new TestOrganization(owner, organizationId);
    if (options?.registerForCleanup) registerTestOrganization(instance);
    return instance;
  }

  /**
   * Updates organization info.
   */
  async update(data: { name?: string; slug?: string; metadata?: Record<string, any> }) {
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
    const invitations = await this.listInvitations();
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
    await auth.api.createInvitation({
      body: {
        email,
        role: opts?.role ?? OrgRole.Member,
        organizationId: this.id,
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
