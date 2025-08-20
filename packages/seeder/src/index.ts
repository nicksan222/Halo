import { seedOrganization } from './seeders/organization';

async function main() {
  await seedOrganization();
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
