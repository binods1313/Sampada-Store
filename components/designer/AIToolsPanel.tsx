'use client';

import { useState } from 'react';
import { useDesigner } from '@/context/DesignerContext';
import styles from '@/styles/designer/AIToolsPanel.module.css';

interface AIToolsPanelProps {
    onAddSuggestion: (suggestion: any) => void;
}

export default function AIToolsPanel({ onAddSuggestion }: AIToolsPanelProps) {
    const { designerTier } = useDesigner();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    if (designerTier !== 'ultra') {
        return (
            <div className={styles.locked}>
                <p>🔒 AI Tools available for Ultra subscribers</p>
                <button className={styles.btn} onClick={() => window.location.href = '/designer/subscribe'}>
                    Upgrade to Ultra
                </button>
            </div>
        );
    }

    async function handleGetSuggestions() {
        if (!prompt.trim()) {
            alert('Please enter a design prompt');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/ai/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) throw new Error('Failed to get suggestions');

            const data = await res.json();
            const suggestionsArray = Array.isArray(data.suggestions)
                ? data.suggestions
                : [data.suggestions];
            setSuggestions(suggestionsArray);
        } catch (error) {
            alert('Failed to generate suggestions');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGenerateImage() {
        if (!prompt.trim()) {
            alert('Please enter a design prompt');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/ai/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) throw new Error('Failed to generate image');

            const data = await res.json();
            onAddSuggestion({
                type: 'generated-image',
                imageUrl: data.imageUrl,
                prompt,
            });
        } catch (error) {
            alert('Failed to generate image');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.panel}>
            <h3>🤖 AI Design Assistant</h3>

            <div className={styles.section}>
                <label>Design Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'retro 80s style with neon colors'"
                    className={styles.textarea}
                />
            </div>

            <div className={styles.actions}>
                <button
                    onClick={handleGetSuggestions}
                    disabled={isLoading}
                    className={styles.btn}
                >
                    {isLoading ? 'Loading...' : '💡 Get Suggestions'}
                </button>
                <button
                    onClick={handleGenerateImage}
                    disabled={isLoading}
                    className={styles.btn}
                >
                    {isLoading ? 'Loading...' : '🎨 Generate Image'}
                </button>
            </div>

            {suggestions.length > 0 && (
                <div className={styles.suggestions}>
                    <h4>Design Concepts</h4>
                    {suggestions.map((suggestion, idx) => (
                        <div key={idx} className={styles.suggestion} onClick={() => onAddSuggestion({ type: 'text', ...suggestion })}>
                            <strong>{suggestion.name || `Concept ${idx + 1}`}</strong>
                            <p>{suggestion.description}</p>
                            {suggestion.colors && (
                                <div className={styles.colors}>
                                    {suggestion.colors.map((color: string, i: number) => (
                                        <div
                                            key={i}
                                            className={styles.color}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
