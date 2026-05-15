// @ts-nocheck
/**
 * withAdminGuard - Higher-Order Component for Admin Pages
 *
 * Wraps pages that should only be accessible to admin users.
 * Redirects non-admin users to home page.
 *
 * Usage:
 * export default withAdminGuard(YourPageComponent);
 *
 * Security:
 * - Server-side session check
 * - Client-side verification
 * - Redirects non-admin users
 */

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAdminGuard = (WrappedComponent) => {
  const AdminGuardedComponent = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
      const verifyAdmin = async () => {
        if (status === 'loading') return;

        if (!session) {
          router.push('/');
          return;
        }

        try {
          const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user?.email }),
          });

          const data = await response.json();

          if (!data.isAdmin) {
            router.push('/');
          } else {
            setIsVerified(true);
          }
        } catch (error) {
          console.error('Admin verification failed:', error);
          router.push('/');
        }
      };

      verifyAdmin();
    }, [session, status, router]);

    if (!isVerified) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AdminGuardedComponent.displayName = `withAdminGuard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AdminGuardedComponent;
};

export default withAdminGuard;
