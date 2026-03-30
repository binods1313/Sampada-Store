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
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      // Skip check in development
      if (process.env.NODE_ENV === 'development') {
        setIsAdmin(true);
        setIsChecking(false);
        return;
      }

      // In production, verify admin status
      const verifyAdmin = async () => {
        if (status === 'unauthenticated') {
          router.replace('/');
          return;
        }

        if (status === 'authenticated') {
          try {
            const response = await fetch('/api/verify-admin');
            const data = await response.json();
            
            if (!data.isAdmin) {
              router.replace('/');
              return;
            }
            
            setIsAdmin(true);
          } catch (error) {
            console.error('Admin verification failed:', error);
            router.replace('/');
          }
        }
        
        setIsChecking(false);
      };

      verifyAdmin();
    }, [status, router]);

    // Show loading/redirecting state
    if (isChecking) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0f172a',
          color: '#fff',
          fontFamily: 'monospace',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔒</div>
            <div style={{ fontSize: '14px' }}>Verifying access...</div>
          </div>
        </div>
      );
    }

    // Don't render if not admin (redirect happens in useEffect)
    if (!isAdmin) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  AdminGuardedComponent.displayName = `withAdminGuard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AdminGuardedComponent;
};

export default withAdminGuard;
