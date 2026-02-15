'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const DesignerContext = createContext();

export function DesignerProvider({ children }) {
    const { data: session } = useSession();
    const [designs, setDesigns] = useState([]);
    const [currentDesign, setCurrentDesign] = useState(null);
    const [designerTier, setDesignerTier] = useState('free');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user's designs on mount
    useEffect(() => {
        if (session?.user?.id) {
            fetchDesigns();
            fetchDesignerStatus();
        }
    }, [session?.user?.id]);

    async function fetchDesigns() {
        try {
            setIsLoading(true);
            const res = await fetch('/api/designs');

            if (res.status === 401) {
                // Session might be invalid, don't set designs or error to avoid loop
                return;
            }

            if (!res.ok) {
                console.warn('Failed to fetch designs, status:', res.status);
                setDesigns([]);
                return;
            }

            const data = await res.json();

            // Handle database not connected gracefully
            if (data.dbConnected === false) {
                console.warn('Database not connected, using empty designs array');
                setDesigns([]);
                return;
            }

            setDesigns(data.designs || []);
        } catch (err) {
            console.error('Fetch designs error:', err);
            // Don't set error state to avoid loop, just use empty array
            setDesigns([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchDesignerStatus() {
        try {
            const res = await fetch('/api/user/designer-status');
            if (res.status === 401) return; // Ignore 401s to prevent potential loops

            if (res.ok) {
                const data = await res.json();
                setDesignerTier(data.tier || 'free');
            } else if (res.status === 500) {
                // Handle database errors gracefully
                console.warn('Designer status unavailable (database not connected)');
                setDesignerTier('free'); // Default to free tier
            }
        } catch (err) {
            console.error('Failed to fetch designer status:', err);
            setDesignerTier('free'); // Default to free tier on error
        }
    }

    async function saveDesign(design) {
        try {
            const isNewDesign = !design.id;
            const url = isNewDesign ? '/api/designs' : `/api/designs/${design.id}`;
            const method = isNewDesign ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(design),
            });

            if (!res.ok) throw new Error('Save failed');

            const savedDesign = await res.json();
            if (isNewDesign) {
                setDesigns([savedDesign, ...designs]);
            } else {
                setDesigns(designs.map(d => d.id === savedDesign.id ? savedDesign : d));
            }
            setCurrentDesign(savedDesign);
            return savedDesign;
        } catch (err) {
            setError('Failed to save design');
            throw err;
        }
    }

    async function deleteDesign(designId) {
        try {
            const res = await fetch(`/api/designs/${designId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setDesigns(designs.filter(d => d.id !== designId));
        } catch (err) {
            setError('Failed to delete design');
            throw err;
        }
    }

    return (
        <DesignerContext.Provider
            value={{
                designs,
                currentDesign,
                setCurrentDesign,
                designerTier,
                isLoading,
                error,
                saveDesign,
                deleteDesign,
                fetchDesigns,
            }}
        >
            {children}
        </DesignerContext.Provider>
    );
}

export function useDesigner() {
    const context = useContext(DesignerContext);
    if (!context) {
        throw new Error('useDesigner must be used within DesignerProvider');
    }
    return context;
}
