import { TestSetupBuilder } from '@acme/testing';
import { TestOrganization } from '@acme/testing/src/auth/organization';

/**
 * Credentials:
 *
 * founder: founder@acme.com
 * password: test1234
 */

export async function seedOrganization() {
  const slugBase = 'acme';
  const name = 'Acme Inc';
  const slug = `${slugBase}`;

  const builder = new TestSetupBuilder({ registerForCleanup: false }).withFounder({
    username: 'founder',
    organization: {
      name,
      slug,
      metadata: { plan: 'Pro', source: 'seed' },
      keepCurrentActiveOrganization: true
    }
  });

  const { organization, founder } = await builder.create();

  console.log('Seeded organization:', {
    name,
    slug,
    organizationId: organization?.id,
    founderEmail: founder?.getEmail()
  });

  if (!founder) return;

  // Create a second organization and add the same founder as owner
  const altName = 'Beta LLC';
  const altSlug = 'beta';

  const secondOrg = await TestOrganization.create(founder, {
    name: altName,
    slug: altSlug,
    metadata: { plan: 'Free', source: 'seed' },
    keepCurrentActiveOrganization: true
  });

  console.log('Seeded second organization:', {
    name: altName,
    slug: altSlug,
    organizationId: secondOrg.id,
    founderEmail: founder.getEmail()
  });
}
