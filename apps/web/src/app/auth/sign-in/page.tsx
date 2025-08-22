'use client';

import { authClient } from '@acme/auth/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SignInCredentialsForm } from './credentials-form';
import { SignInOrgSelection } from './org-selection';

export default function SignIn() {
  const [showOrgSelector, setShowOrgSelector] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirectTo') || '/';

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showOrgSelector ? (
        <motion.div
          key="org-select"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <SignInOrgSelection
            onContinue={async (orgId) => {
              await authClient.organization.setActive({ organizationId: orgId });
              router.push(redirectTo);
            }}
            onGoBack={() => setShowOrgSelector(false)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="credentials"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <SignInCredentialsForm onSuccess={() => setShowOrgSelector(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
