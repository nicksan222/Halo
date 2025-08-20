/**
 * Next.js Configuration for OwnFit Web Trainer Application
 *
 * This configuration file sets up Next.js for the web trainer application
 * with necessary package transpilation for monorepo dependencies.
 *
 * @fileoverview Next.js configuration for web trainer app
 */

import type { NextConfig } from 'next';

/**
 * Next.js configuration for the web trainer application.
 *
 * Features:
 * - Package transpilation for monorepo workspace dependencies
 * - Optimized for UI components and API client packages
 * - Disabled source maps in development to prevent errors
 */
const nextConfig: NextConfig = {
  /**
   * Transpile packages from the monorepo workspace.
   * This is required for packages that are not pre-compiled
   * and need to be processed by Next.js build system.
   */
  transpilePackages: ['@acme/ui', '@acme/auth', '@acme/api', '@acme/env'],

  /**
   * Disable source maps in development to prevent source map errors.
   * This fixes the "payload is not an Object" error in development.
   */
  productionBrowserSourceMaps: false
};

export default nextConfig;
