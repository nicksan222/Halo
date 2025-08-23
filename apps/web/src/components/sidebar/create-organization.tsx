'use client';

import { authClient } from '@acme/auth/client';
import { useState } from 'react';

export function slugifyOrganizationName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createOrganizationDirect(input: { name: string; slug?: string }) {
  const name = (input.name ?? '').trim();
  if (!name) throw new Error('Invalid team name');
  const slug = input.slug && input.slug.length > 0 ? input.slug : slugifyOrganizationName(name);
  await authClient.organization.create({ name, slug });
}

export interface CreateOrganizationLabels {
  invalidName?: string;
}

export interface CreateOrganizationApi {
  create: (name: string) => Promise<void>;
  isCreating: boolean;
}

export function CreateOrganization({
  labels = {},
  children
}: {
  labels?: CreateOrganizationLabels;
  children: (api: CreateOrganizationApi) => React.ReactNode;
}) {
  const [isCreating, setIsCreating] = useState(false);

  async function create(name: string) {
    const trimmed = (name ?? '').trim();
    const invalidName = labels.invalidName ?? 'Invalid team name';
    if (!trimmed) {
      throw new Error(invalidName);
    }
    try {
      setIsCreating(true);
      const slug = slugifyOrganizationName(trimmed);
      await authClient.organization.create({ name: trimmed, slug });
    } finally {
      setIsCreating(false);
    }
  }

  return children({ create, isCreating });
}
