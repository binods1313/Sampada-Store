'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/designer/PropertiesPanel.module.css';

interface SelectedObject {
    id: string;
    type: string;
    left: number;
    top: number;
    width: number;
    height: number;
    angle: number;
    scaleX: number;
    scaleY: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    // Text properties
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: string;
}

interface PropertiesPanelProps {
    selectedObject: SelectedObject | null;
    onUpdateProperty: (property: string, value: any) => void;
}

const FONT_FAMILIES = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Impact',
    'Comic Sans MS',
];

const COLOR_PRESETS = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
];

export default function PropertiesPanel({
    selectedObject,
    onUpdateProperty,
}: PropertiesPanelProps) {
    const [localValues, setLocalValues] = useState<Partial<SelectedObject>>({});

    useEffect(() => {
        if (selectedObject) {
            setLocalValues(selectedObject);
        }
    }, [selectedObject]);

    if (!selectedObject) {
        return (
            <div className={styles.panel}>
                <div className={styles.header}>
                    <h3>Properties</h3>
                </div>
                <div className={styles.empty}>
                    Select an object to edit its properties
                </div>
            </div>
        );
    }

    const handleChange = (property: string, value: any) => {
        setLocalValues({ ...localValues, [property]: value });
        onUpdateProperty(property, value);
    };

    const isText = selectedObject.type === 'text' || selectedObject.type === 'i-text';

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h3>Properties</h3>
                <span className={styles.type}>{selectedObject.type}</span>
            </div>

            <div className={styles.sections}>
                {/* Position & Size */}
                <div className={styles.section}>
                    <h4>Position & Size</h4>
                    <div className={styles.grid2}>
                        <div className={styles.field}>
                            <label>X</label>
                            <input
                                type="number"
                                value={Math.round(localValues.left || 0)}
                                onChange={(e) => handleChange('left', Number(e.target.value))}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Y</label>
                            <input
                                type="number"
                                value={Math.round(localValues.top || 0)}
                                onChange={(e) => handleChange('top', Number(e.target.value))}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Width</label>
                            <input
                                type="number"
                                value={Math.round((localValues.width || 0) * (localValues.scaleX || 1))}
                                onChange={(e) => handleChange('width', Number(e.target.value))}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Height</label>
                            <input
                                type="number"
                                value={Math.round((localValues.height || 0) * (localValues.scaleY || 1))}
                                onChange={(e) => handleChange('height', Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Rotation</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={localValues.angle || 0}
                            onChange={(e) => handleChange('angle', Number(e.target.value))}
                        />
                        <span>{Math.round(localValues.angle || 0)}°</span>
                    </div>
                </div>

                {/* Colors */}
                <div className={styles.section}>
                    <h4>Appearance</h4>
                    <div className={styles.field}>
                        <label>Fill Color</label>
                        <div className={styles.colorPicker}>
                            <input
                                type="color"
                                value={localValues.fill || '#000000'}
                                onChange={(e) => handleChange('fill', e.target.value)}
                            />
                            <div className={styles.presets}>
                                {COLOR_PRESETS.map((color) => (
                                    <button
                                        key={color}
                                        className={styles.presetColor}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleChange('fill', color)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Stroke Color</label>
                        <input
                            type="color"
                            value={localValues.stroke || '#000000'}
                            onChange={(e) => handleChange('stroke', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Stroke Width</label>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            value={localValues.strokeWidth || 0}
                            onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Opacity</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={localValues.opacity ?? 1}
                            onChange={(e) => handleChange('opacity', Number(e.target.value))}
                        />
                        <span>{Math.round((localValues.opacity ?? 1) * 100)}%</span>
                    </div>
                </div>

                {/* Text Properties */}
                {isText && (
                    <div className={styles.section}>
                        <h4>Text</h4>
                        <div className={styles.field}>
                            <label>Font Family</label>
                            <select
                                value={localValues.fontFamily || 'Arial'}
                                onChange={(e) => handleChange('fontFamily', e.target.value)}
                            >
                                {FONT_FAMILIES.map((font) => (
                                    <option key={font} value={font}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.grid2}>
                            <div className={styles.field}>
                                <label>Size</label>
                                <input
                                    type="number"
                                    min="8"
                                    max="200"
                                    value={localValues.fontSize || 20}
                                    onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Weight</label>
                                <select
                                    value={localValues.fontWeight || 'normal'}
                                    onChange={(e) => handleChange('fontWeight', e.target.value)}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="bold">Bold</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>Alignment</label>
                            <div className={styles.alignButtons}>
                                <button
                                    className={localValues.textAlign === 'left' ? styles.active : ''}
                                    onClick={() => handleChange('textAlign', 'left')}
                                >
                                    ⬅️
                                </button>
                                <button
                                    className={localValues.textAlign === 'center' ? styles.active : ''}
                                    onClick={() => handleChange('textAlign', 'center')}
                                >
                                    ↔️
                                </button>
                                <button
                                    className={localValues.textAlign === 'right' ? styles.active : ''}
                                    onClick={() => handleChange('textAlign', 'right')}
                                >
                                    ➡️
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
