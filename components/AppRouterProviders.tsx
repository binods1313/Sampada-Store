'use client';

import { SessionProvider } from 'next-auth/react';
import { DesignerProvider } from '../context/DesignerContext';

export function AppRouterProviders({ children, session }: { children: React.ReactNode, session: any }) {
    return (
        <SessionProvider session={session}>
            <DesignerProvider>
                {children}
            </DesignerProvider>
        </SessionProvider>
    );
}
