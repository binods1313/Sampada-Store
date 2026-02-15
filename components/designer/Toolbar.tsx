'use client';

import { useState } from 'react';
import styles from '../../styles/designer/Toolbar.module.css';

interface ToolbarProps {
    onAddText: () => void;
    onAddRectangle: () => void;
    onAddCircle: () => void;
    onAddImage: (file: File) => void;
    onDelete: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onExport: () => void;
    canUndo: boolean;
    canRedo: boolean;
    designerTier: string;
}

export default function Toolbar({
    onAddText,
    onAddRectangle,
    onAddCircle,
    onAddImage,
    onDelete,
    onUndo,
    onRedo,
    onZoomIn,
    onZoomOut,
    onExport,
    canUndo,
    canRedo,
    designerTier,
}: ToolbarProps) {
    const [activeCategory, setActiveCategory] = useState<'shapes' | 'text' | 'media'>('shapes');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onAddImage(file);
        }
    };

    return (
        <div className={styles.toolbar}>
            {/* Top toolbar - History & Zoom */}
            <div className={styles.topBar}>
                <div className={styles.historyGroup}>
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className={styles.iconBtn}
                        title="Undo"
                    >
                        ↩️
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className={styles.iconBtn}
                        title="Redo"
                    >
                        ↪️
                    </button>
                </div>

                <div className={styles.zoomGroup}>
                    <button onClick={onZoomOut} className={styles.iconBtn} title="Zoom Out">
                        ➖
                    </button>
                    <button onClick={onZoomIn} className={styles.iconBtn} title="Zoom In">
                        ➕
                    </button>
                </div>
            </div>

            {/* Category tabs */}
            <div className={styles.categoryTabs}>
                <button
                    className={`${styles.tabBtn} ${activeCategory === 'shapes' ? styles.active : ''}`}
                    onClick={() => setActiveCategory('shapes')}
                >
                    Shapes
                </button>
                <button
                    className={`${styles.tabBtn} ${activeCategory === 'text' ? styles.active : ''}`}
                    onClick={() => setActiveCategory('text')}
                >
                    Text
                </button>
                <button
                    className={`${styles.tabBtn} ${activeCategory === 'media' ? styles.active : ''}`}
                    onClick={() => setActiveCategory('media')}
                >
                    Media
                </button>
            </div>

            {/* Tool buttons based on category */}
            <div className={styles.toolButtons}>
                {activeCategory === 'shapes' && (
                    <>
                        <button onClick={onAddRectangle} className={styles.toolBtn}>
                            <span className={styles.icon}>▭</span>
                            Rectangle
                        </button>
                        <button onClick={onAddCircle} className={styles.toolBtn}>
                            <span className={styles.icon}>○</span>
                            Circle
                        </button>
                        <button onClick={() => { }} className={styles.toolBtn}>
                            <span className={styles.icon}>△</span>
                            Triangle
                        </button>
                        <button onClick={() => { }} className={styles.toolBtn}>
                            <span className={styles.icon}>★</span>
                            Star
                        </button>
                    </>
                )}

                {activeCategory === 'text' && (
                    <>
                        <button onClick={onAddText} className={styles.toolBtn}>
                            <span className={styles.icon}>T</span>
                            Add Heading
                        </button>
                        <button onClick={onAddText} className={styles.toolBtn}>
                            <span className={styles.icon}>Tt</span>
                            Add Body Text
                        </button>
                    </>
                )}

                {activeCategory === 'media' && (
                    <>
                        <label className={styles.toolBtn}>
                            <span className={styles.icon}>🖼️</span>
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className={styles.hiddenInput}
                            />
                        </label>
                        {designerTier === 'ultra' && (
                            <button className={styles.toolBtn}>
                                <span className={styles.icon}>🤖</span>
                                AI Generate
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button onClick={onDelete} className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                    🗑️ Delete
                </button>
                <button onClick={onExport} className={`${styles.actionBtn} ${styles.exportBtn}`}>
                    📤 Export
                </button>
            </div>
        </div>
    );
}
