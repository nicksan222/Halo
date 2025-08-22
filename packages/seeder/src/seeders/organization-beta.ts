import { OrganizationRole as OrgRole } from '@acme/auth';
import { TestSetupBuilder } from '@acme/testing';

export async function seedBetaOrganization() {
  const name = 'Beta LLC';
  const slug = 'beta';

  const builder = new TestSetupBuilder({ registerForCleanup: false }).withFounder({
    username: 'founder',
    organization: {
      name,
      slug,
      metadata: { plan: 'Free', source: 'seed' },
      keepCurrentActiveOrganization: false
    }
  });

  // Add a couple members per role
  builder.withMember({ role: OrgRole.Member });
  builder.withMember({ role: OrgRole.Member });
  builder.withMember({ role: OrgRole.Admin });
  builder.withMember({ role: OrgRole.Admin });

  const { organization, founder, members } = await builder.create();

  console.log('Seeded Beta organization:', {
    name,
    slug,
    organizationId: organization?.id,
    founderEmail: founder?.getEmail(),
    membersAdded: members.length
  });
}
