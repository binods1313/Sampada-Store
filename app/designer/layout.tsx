'use client';

import { SessionProvider } from 'next-auth/react';
import { DesignerProvider } from '../../context/DesignerContext';

export default function DesignerLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <DesignerProvider>
                {children}
            </DesignerProvider>
        </SessionProvider>
    );
}
