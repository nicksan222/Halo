import { TestSetupBuilder } from '@acme/testing';

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
}
