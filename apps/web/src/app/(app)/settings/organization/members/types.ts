import type { auth } from '@acme/auth';

export type Member = typeof auth.$Infer.Member;
export type Session = typeof auth.$Infer.Session;
export type Role = Member['role'];

export interface MembersPageProps {
  /** List of all organization members */
  members: Member[];
  /** Current user's session */
  session: Session;
  /** Current user's membership in the organization */
  currentUserMembership: Member;
  /** Organization ID */
  organizationId: string;
}

export interface MemberItemProps {
  /** Member to display */
  member: Member;
  /** Current user's membership */
  currentUserMembership: Member;
  /** All members for permission calculations */
  allMembers: Member[];
  /** Organization ID */
  organizationId: string;
  /** Callback when member is removed */
  onMemberRemoved?: () => void;
}

export interface RemoveMemberProps {
  /** Member ID to remove */
  memberId: string;
  /** Member name for display */
  memberName: string;
  /** Organization ID */
  organizationId: string;
  /** Success callback */
  onSuccess?: () => void;
}

export interface ChangeMemberRoleProps {
  /** Member ID whose role will be changed */
  memberId: string;
  /** Member name for display */
  memberName: string;
  /** Current role to preselect */
  currentRole: Role;
  /** Organization ID */
  organizationId: string;
  /** Success callback */
  onSuccess?: () => void;
}

export interface InviteMemberProps {
  /** Organization ID */
  organizationId: string;
  /** Callback after successful invitation */
  onInvited?: () => void;
}
