import React, { useState } from 'react';

function BulkAutoTag() {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(null);
    const [logs, setLogs] = useState([]);

    // ── Gemini bulk tagger state ──────────────────────────────────────────────
    const [geminiStatus, setGeminiStatus] = useState('idle')
    const [geminiProgress, setGeminiProgress] = useState(null)
    const [geminiLogs, setGeminiLogs] = useState([])

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
            if (process.env.NODE_ENV !== 'production') console.error('Bulk tagging error:', error);
            setLogs(prev => [...prev, `Critical Error: ${error.message}`]);
        }
    };

    // ── Gemini bulk tagger ────────────────────────────────────────────────────
    const startGeminiTagging = async () => {
        setGeminiStatus('running')
        setGeminiLogs([])
        setGeminiProgress(null)

        try {
            setGeminiLogs(prev => [...prev, 'Fetching product IDs...'])
            const res = await fetch('/api/products/list-ids')
            if (!res.ok) throw new Error('Failed to fetch product IDs')
            const { ids } = await res.json()

            if (!ids || ids.length === 0) {
                setGeminiLogs(prev => [...prev, 'No products found.'])
                setGeminiStatus('idle')
                return
            }

            setGeminiLogs(prev => [...prev, `Found ${ids.length} products. Starting Gemini tagging...`])

            let completed = 0, successes = 0, failures = 0

            for (const productId of ids) {
                try {
                    const r = await fetch('/api/products/gemini-auto-tag', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId }),
                    })
                    const data = await r.json()
                    if (data.success) {
                        successes++
                        setGeminiLogs(prev => [...prev, `✓ ${data.productName || productId} — ${data.applied?.tags?.slice(0,3).join(', ')}`])
                    } else {
                        failures++
                        setGeminiLogs(prev => [...prev, `✗ ${productId}: ${data.error}`])
                    }
                } catch (err) {
                    failures++
                    setGeminiLogs(prev => [...prev, `✗ ${productId}: network error`])
                }

                completed++
                setGeminiProgress({
                    total: ids.length,
                    completed,
                    percentage: Math.round((completed / ids.length) * 100),
                })

                // Rate limit: 1 request per second to avoid Gemini quota
                await new Promise(r => setTimeout(r, 1000))
            }

            setGeminiStatus('completed')
            setGeminiLogs(prev => [...prev, `Done! ✓ ${successes} tagged, ✗ ${failures} failed`])
        } catch (error) {
            setGeminiStatus('error')
            setGeminiLogs(prev => [...prev, `Critical error: ${error.message}`])
        }
    }

    return (
        <div>
        {/* ── Gemini Auto-Tagger (new) ─────────────────────────────────────── */}        <div style={{
            padding: '20px',
            border: '1px solid rgba(201,169,110,0.3)',
            borderRadius: '12px',
            maxWidth: '600px',
            margin: '0 auto 32px',
            backgroundColor: '#1a1a1a',
            color: '#ffffff'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>✨</span>
                <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#c9a96e' }}>Gemini AI Bulk Tagger</h2>
                <span style={{ fontSize: '0.65rem', background: 'rgba(201,169,110,0.15)', color: '#c9a96e', padding: '2px 8px', borderRadius: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>New</span>
            </div>
            <p style={{ color: '#888', marginBottom: '16px', fontSize: '0.85rem' }}>
                Uses Gemini Vision to generate tags, SEO, occasion, colour, and description for every product.
            </p>

            <button
                onClick={startGeminiTagging}
                disabled={geminiStatus === 'running'}
                style={{
                    padding: '10px 22px',
                    backgroundColor: geminiStatus === 'running' ? '#333' : '#c9a96e',
                    color: geminiStatus === 'running' ? '#888' : '#0d1126',
                    border: 'none', borderRadius: '6px',
                    fontSize: '0.85rem', fontWeight: 700,
                    cursor: geminiStatus === 'running' ? 'not-allowed' : 'pointer',
                    marginBottom: '16px',
                }}
            >
                {geminiStatus === 'running' ? 'Tagging...' : '✨ Start Gemini Tagging'}
            </button>

            {geminiProgress && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ height: '8px', width: '100%', background: '#2a2a2a', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${geminiProgress.percentage}%`, background: '#c9a96e', transition: 'width 0.3s' }} />
                    </div>
                    <p style={{ textAlign: 'right', fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                        {geminiProgress.completed} / {geminiProgress.total} ({geminiProgress.percentage}%)
                    </p>
                </div>
            )}

            {geminiLogs.length > 0 && (
                <div style={{ background: '#0f0f0f', padding: '10px', borderRadius: '6px', maxHeight: '180px', overflowY: 'auto', fontSize: '0.78rem', fontFamily: 'monospace', color: '#888', border: '1px solid rgba(201,169,110,0.08)' }}>
                    {geminiLogs.map((log, i) => (
                        <div key={i} style={{ padding: '1px 0', color: log.startsWith('✓') ? '#4ade80' : log.startsWith('✗') ? '#f87171' : '#888' }}>{log}</div>
                    ))}
                </div>
            )}

            {geminiStatus === 'completed' && (
                <p style={{ marginTop: '12px', color: '#4ade80', fontWeight: 700, fontSize: '0.85rem' }}>✓ Gemini tagging complete.</p>
            )}
        </div>

        {/* ── Original Cloud Vision Tagger ─────────────────────────────────── */}
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
        </div>
    );
}

export default BulkAutoTag;
