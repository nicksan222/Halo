import { OrganizationRole as OrgRole } from '@acme/auth';
import { TestSetupBuilder } from '@acme/testing';

/**
 * Credentials:
 *
 * founder: founder@acme.com
 * password: test1234
 */

export async function seedAcmeOrganization() {
  const name = 'Acme Inc';
  const slug = 'acme';

  const builder = new TestSetupBuilder({ registerForCleanup: false }).withFounder({
    username: 'founder',
    organization: {
      name,
      slug,
      metadata: { plan: 'Pro', source: 'seed' },
      keepCurrentActiveOrganization: true
    }
  });

  // Add a couple members per role
  builder.withMember({ role: OrgRole.Member });
  builder.withMember({ role: OrgRole.Member });
  builder.withMember({ role: OrgRole.Admin });
  builder.withMember({ role: OrgRole.Admin });

  const { organization, founder, members } = await builder.create();

  console.log('Seeded Acme organization:', {
    name,
    slug,
    organizationId: organization?.id,
    founderEmail: founder?.getEmail(),
    membersAdded: members.length
  });
}
