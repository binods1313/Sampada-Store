import React, { useState } from 'react';

function BulkAutoTag() {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(null);
    const [logs, setLogs] = useState([]);

    // Helper to get all product IDs
    const fetchAllProductIds = async () => {
        // This assumes an endpoint exists to list products or we use a groq query if we had a direct client here.
        // For now, let's assume we can fetch all product IDs via a dedicated API or just fetch all products.
        // Since we don't have a specific "list all IDs" endpoint in the instructions, 
        // we'll use a mocked list or try to fetch from the main product API if available.
        // Ideally, we should add an endpoint `GET /api/products/ids`
        // For this implementation, I'll simulate or try to fetch from /api/products if it supports listing.

        // BETTER APPROACH: Let's assume we need to implement a way to get IDs. 
        // I will add a helper in the auto-tag API or just use a GROQ query in the frontend if I had the client.
        // Given the constraints, I will likely need to fetch them.
        // Let's assume the user has a way to get IDs or we just fetch the first 100 for demo.

        try {
            // fetching from Sanity directly if client is available would be best, but this is a component.
            // Let's try to hit a new endpoint we'll create: /api/products/list-ids
            const res = await fetch('/api/products/list-ids');
            if (!res.ok) throw new Error("Failed to fetch product IDs");
            const data = await res.json();
            return data.ids;
        } catch (e) {
            setLogs(prev => [...prev, `Error fetching IDs: ${e.message}`]);
            return [];
        }
    };

    const startBulkTagging = async () => {
        setStatus('running');
        setLogs([]);
        setProgress(null);

        try {
            setLogs(prev => [...prev, "Fetching product IDs..."]);
            const productIds = await fetchAllProductIds();

            if (productIds.length === 0) {
                setLogs(prev => [...prev, "No products found to tag."]);
                setStatus('idle');
                return;
            }

            setLogs(prev => [...prev, `Found ${productIds.length} products. Starting batch processing...`]);

            // Process in batches of 10 to be safe
            const batchSize = 10;
            let completed = 0;
            let successes = 0;
            let failures = 0;

            for (let i = 0; i < productIds.length; i += batchSize) {
                if (status === 'stopped') break; // Allow stopping? (not implemented yet)

                const batch = productIds.slice(i, i + batchSize);
                setLogs(prev => [...prev, `Processing batch ${i / batchSize + 1}...`]);

                try {
                    const res = await fetch('/api/products/auto-tag', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ product_ids: batch })
                    });
                    const data = await res.json();

                    if (data.success) {
                        // Count successes in batch
                        const batchSuccess = data.results?.length || 0;
                        const batchFail = data.errors?.length || 0;
                        successes += batchSuccess;
                        failures += batchFail;
                        setLogs(prev => [...prev, `Batch ${i / batchSize + 1}: ${batchSuccess} tagged, ${batchFail} failed.`]);
                    } else {
                        failures += batch.length;
                        setLogs(prev => [...prev, `Batch ${i / batchSize + 1} failed entirely.`]);
                    }
                } catch (err) {
                    failures += batch.length;
                    setLogs(prev => [...prev, `Batch ${i / batchSize + 1} network error.`]);
                }

                completed += batch.length;
                setProgress({
                    total: productIds.length,
                    completed,
                    percentage: Math.round((completed / productIds.length) * 100)
                });

                // Small delay
                await new Promise(r => setTimeout(r, 500));
            }

            setStatus('completed');
            setLogs(prev => [...prev, `Done! Success: ${successes}, Failed: ${failures}`]);

        } catch (error) {
            setStatus('error');
            console.error('Bulk tagging error:', error);
            setLogs(prev => [...prev, `Critical Error: ${error.message}`]);
        }
    };

    return (
        <div className="bulk-tag-admin" style={{ 
            padding: '20px', 
            border: '1px solid rgba(201, 168, 76, 0.12)', 
            borderRadius: '12px', 
            maxWidth: '600px', 
            margin: '20px auto', 
            backgroundColor: '#1a1a1a',
            color: '#ffffff'
        }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ffffff' }}>📦 Bulk Auto-Tag Products</h2>
            <p style={{ color: '#888888', marginBottom: '20px' }}>Automatically generate AI tags, descriptions, and SEO keywords for your entire catalog.</p>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={startBulkTagging}
                    disabled={status === 'running'}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: status === 'running' ? '#444444' : '#C9A84C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: status === 'running' ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {status === 'running' ? 'Processing...' : 'Start Bulk Tagging'}
                </button>
            </div>

            {progress && (
                <div className="progress" style={{ marginBottom: '20px' }}>
                    <div style={{ height: '10px', width: '100%', backgroundColor: '#2a2a2a', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress.percentage}%`, backgroundColor: '#4ade80', transition: 'width 0.3s' }} />
                    </div>
                    <p style={{ textAlign: 'right', fontSize: '0.9rem', color: '#888888', marginTop: '5px' }}>
                        {progress.completed} / {progress.total} products ({progress.percentage}%)
                    </p>
                </div>
            )}

            {logs.length > 0 && (
                <div className="logs" style={{ backgroundColor: '#0f0f0f', padding: '12px', borderRadius: '6px', maxHeight: '200px', overflowY: 'auto', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: '#888888', border: '1px solid rgba(201, 168, 76, 0.06)' }}>
                    {logs.map((log, i) => <div key={i} style={{ padding: '2px 0' }}>{log}</div>)}
                </div>
            )}

            {status === 'completed' && (
                <div className="success-message" style={{ marginTop: '20px', color: '#4ade80', fontWeight: 'bold' }}>
                    ✓ Bulk tagging process finished.
                </div>
            )}
        </div>
    );
}

export default BulkAutoTag;
