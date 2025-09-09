/**
 * Tailwind CSS Configuration for OwnFit Auth Application
 *
 * This configuration uses the centralized @acme/tailwind-config package
 * to ensure consistency across all applications in the monorepo.
 *
 * @fileoverview Tailwind CSS configuration for auth app using shared config
 */

import { createWebTailwindConfig } from '@acme/tailwind-config/web';

export default createWebTailwindConfig(__dirname);
