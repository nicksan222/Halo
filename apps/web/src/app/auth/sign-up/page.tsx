'use client';

import { authClient } from '@acme/auth/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SignUpCredentialsForm } from './credentials-form';
import { SignUpOrgSelection } from './org-selection';

export default function SignUp() {
  const router = useRouter();
  const [showOrgSelector, setShowOrgSelector] = useState(false);

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
          <SignUpOrgSelection
            onContinue={async (orgId) => {
              await authClient.organization.setActive({ organizationId: orgId });
              router.push('/');
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
          <SignUpCredentialsForm onSuccess={() => setShowOrgSelector(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
