/**
 * Admin Verification API
 * 
 * Server-side verification of admin status.
 * Used by DevToolsPanel to verify user has admin access.
 * 
 * Security:
 * - Checks session server-side (not trustable client data)
 * - Verifies against admin email whitelist
 * - Returns only isAdmin boolean (no sensitive data)
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

// Admin email whitelist
const ADMIN_EMAILS = ['admin@sampada.com', 'admin@localhost'];

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ isAdmin: false });
  }

  try {
    // Get session server-side
    const session = await getServerSession(req, res, authOptions);

    // No session = not admin
    if (!session?.user?.email) {
      return res.status(200).json({ isAdmin: false });
    }

    // Check if email is in admin whitelist
    const userEmail = session.user.email.toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(userEmail);

    // Log admin access attempts (useful for security auditing)
    if (isAdmin) {
      console.log('[Admin Verify] Admin access granted:', userEmail);
    } else {
      console.log('[Admin Verify] Non-admin access attempt:', userEmail);
    }

    return res.status(200).json({ isAdmin });
  } catch (error) {
    console.error('[Admin Verify] Error:', error);
    return res.status(200).json({ isAdmin: false });
  }
}
