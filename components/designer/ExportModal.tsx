'use client';

import { useState } from 'react';
import { useDesigner } from '@/context/DesignerContext';
import styles from '@/styles/designer/ExportModal.module.css';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    designId: string;
}

export default function ExportModal({ isOpen, onClose, designId }: ExportModalProps) {
    const { currentDesign } = useDesigner();
    const [isExporting, setIsExporting] = useState(false);
    const [exportResult, setExportResult] = useState<any>(null);

    if (!isOpen) return null;

    async function handleExport() {
        setIsExporting(true);
        try {
            const res = await fetch('/api/designs/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ designId }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error);
            }

            const result = await res.json();
            setExportResult(result);
        } catch (error) {
            alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>

                <h2>Export Design to Printify</h2>

                {!exportResult ? (
                    <>
                        <div className={styles.info}>
                            <p>📦 Design: <strong>{currentDesign?.name}</strong></p>
                            <p>📏 Size: 800x1000px</p>
                            <p>🎨 Tier: <strong>{currentDesign?.tier}</strong></p>
                        </div>

                        <div className={styles.preview}>
                            {currentDesign?.thumbnail && (
                                <img
                                    src={currentDesign.thumbnail}
                                    alt="Design preview"
                                    className={styles.image}
                                />
                            )}
                        </div>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className={styles.exportBtn}
                        >
                            {isExporting ? 'Exporting...' : 'Export to Printify'}
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles.success}>
                            <div className={styles.checkmark}>✓</div>
                            <h3>Export Successful!</h3>
                            <p>Your design has been published to Printify</p>
                        </div>

                        <div className={styles.details}>
                            <p>Product ID: <code>{exportResult.productId}</code></p>
                            <a
                                href={exportResult.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                View on Printify →
                            </a>
                        </div>

                        <button
                            onClick={onClose}
                            className={styles.closeModalBtn}
                        >
                            Close
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
