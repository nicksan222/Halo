import { auth } from '@acme/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Ensure this route executes on the Node.js runtime.
// Better Auth and our DB adapter rely on Node APIs (e.g., node:fs),
// which are not available in the Edge runtime.
export const runtime = 'nodejs';

export const { GET, POST } = toNextJsHandler(auth.handler);
