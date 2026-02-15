'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/designer/LayerPanel.module.css';

interface Layer {
    id: string;
    name: string;
    type: string;
    visible: boolean;
    locked: boolean;
}

interface LayerPanelProps {
    layers: Layer[];
    selectedLayerId: string | null;
    onSelectLayer: (id: string) => void;
    onToggleVisibility: (id: string) => void;
    onToggleLock: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
    onDeleteLayer: (id: string) => void;
    onRenameLayer: (id: string, name: string) => void;
}

export default function LayerPanel({
    layers,
    selectedLayerId,
    onSelectLayer,
    onToggleVisibility,
    onToggleLock,
    onMoveUp,
    onMoveDown,
    onDeleteLayer,
    onRenameLayer,
}: LayerPanelProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleStartEdit = (layer: Layer) => {
        setEditingId(layer.id);
        setEditName(layer.name);
    };

    const handleFinishEdit = (id: string) => {
        if (editName.trim()) {
            onRenameLayer(id, editName.trim());
        }
        setEditingId(null);
    };

    const getLayerIcon = (type: string) => {
        switch (type) {
            case 'text':
            case 'i-text':
                return '📝';
            case 'rect':
                return '▭';
            case 'circle':
                return '○';
            case 'image':
                return '🖼️';
            case 'group':
                return '📁';
            default:
                return '◇';
        }
    };

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h3>Layers</h3>
                <span className={styles.count}>{layers.length}</span>
            </div>

            <div className={styles.layerList}>
                {layers.length === 0 ? (
                    <div className={styles.empty}>
                        No objects on canvas
                    </div>
                ) : (
                    layers.map((layer, index) => (
                        <div
                            key={layer.id}
                            className={`${styles.layer} ${selectedLayerId === layer.id ? styles.selected : ''} ${!layer.visible ? styles.hidden : ''}`}
                            onClick={() => onSelectLayer(layer.id)}
                        >
                            <span className={styles.icon}>{getLayerIcon(layer.type)}</span>

                            {editingId === layer.id ? (
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onBlur={() => handleFinishEdit(layer.id)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFinishEdit(layer.id)}
                                    className={styles.nameInput}
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className={styles.name}
                                    onDoubleClick={() => handleStartEdit(layer)}
                                >
                                    {layer.name}
                                </span>
                            )}

                            <div className={styles.actions}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleVisibility(layer.id);
                                    }}
                                    className={styles.actionBtn}
                                    title={layer.visible ? 'Hide' : 'Show'}
                                >
                                    {layer.visible ? '👁️' : '👁️‍🗨️'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleLock(layer.id);
                                    }}
                                    className={styles.actionBtn}
                                    title={layer.locked ? 'Unlock' : 'Lock'}
                                >
                                    {layer.locked ? '🔒' : '🔓'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedLayerId && (
                <div className={styles.layerActions}>
                    <button
                        onClick={() => onMoveUp(selectedLayerId)}
                        className={styles.moveBtn}
                        title="Move Up"
                    >
                        ⬆️
                    </button>
                    <button
                        onClick={() => onMoveDown(selectedLayerId)}
                        className={styles.moveBtn}
                        title="Move Down"
                    >
                        ⬇️
                    </button>
                    <button
                        onClick={() => onDeleteLayer(selectedLayerId)}
                        className={`${styles.moveBtn} ${styles.deleteBtn}`}
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            )}
        </div>
    );
}
