import { seedAcmeOrganization } from './seeders/organization-acme';
import { seedBetaOrganization } from './seeders/organization-beta';

async function main() {
  await seedAcmeOrganization();
  await seedBetaOrganization();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
