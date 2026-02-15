'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useDesigner } from '../../context/DesignerContext';
import { useSession } from 'next-auth/react';
import styles from '../../styles/designer/Canvas.module.css';

interface CanvasProps {
    designId?: string;
}

export default function Canvas({ designId }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const { currentDesign, setCurrentDesign, saveDesign } = useDesigner();
    const { data: session } = useSession();

    const [isSaving, setIsSaving] = useState(false);
    const [designName, setDesignName] = useState('New Design');

    // Initialize canvas
    useEffect(() => {
        if (!canvasRef.current || !session?.user?.id) return;

        fabricRef.current = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 1000,
            backgroundColor: '#ffffff',
        });

        // Load existing design if editing
        if (designId) {
            loadDesign(designId);
        }

        return () => {
            fabricRef.current?.dispose();
        };
    }, [designId, session?.user?.id]);

    async function loadDesign(id: string) {
        try {
            const res = await fetch(`/api/designs/${id}`);
            if (!res.ok) throw new Error('Load failed');

            const design = await res.json();
            setDesignName(design.name);
            setCurrentDesign(design);

            if (fabricRef.current && design.canvasData) {
                // Fabric.js v6+ loadFromJSON is async and returns a promise
                await fabricRef.current.loadFromJSON(design.canvasData);
                fabricRef.current.renderAll();
            }
        } catch (error) {
            console.error('Failed to load design:', error);
            // Don't alert on load failure to avoid blocking UI during loop
        }
    }

    async function handleSave() {
        if (!fabricRef.current) return;

        setIsSaving(true);
        try {
            const canvasData = fabricRef.current.toJSON();
            const thumbnail = fabricRef.current.toDataURL({
                format: 'png',
                quality: 0.8,
                multiplier: 0.25,
            });

            const savedDesign = await saveDesign({
                id: currentDesign?.id,
                name: designName,
                canvasData,
                thumbnail,
            });

            alert('Design saved successfully!');
        } catch (error) {
            alert('Failed to save design');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    function addText() {
        if (!fabricRef.current) return;

        const text = new fabric.IText('Click to edit', {
            left: 100,
            top: 100,
            fontSize: 40,
            fill: '#000000',
        });

        fabricRef.current.add(text);
        fabricRef.current.setActiveObject(text);
        fabricRef.current.renderAll();
    }

    function addRectangle() {
        if (!fabricRef.current) return;

        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 200,
            height: 150,
            fill: '#3b82f6',
        });

        fabricRef.current.add(rect);
        fabricRef.current.setActiveObject(rect);
        fabricRef.current.renderAll();
    }

    function addCircle() {
        if (!fabricRef.current) return;

        const circle = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 75,
            fill: '#ef4444',
        });

        fabricRef.current.add(circle);
        fabricRef.current.setActiveObject(circle);
        fabricRef.current.renderAll();
    }

    function deleteSelected() {
        if (!fabricRef.current) return;

        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            fabricRef.current.remove(activeObject);
            fabricRef.current.renderAll();
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Design Canvas</h1>
                    <input
                        type="text"
                        value={designName}
                        onChange={(e) => setDesignName(e.target.value)}
                        className={styles.nameInput}
                        placeholder="Design name"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={styles.saveBtn}
                >
                    {isSaving ? 'Saving...' : 'Save Design'}
                </button>
            </div>

            <div className={styles.workspace}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <button onClick={addText} className={styles.toolBtn}>
                        Add Text
                    </button>
                    <button onClick={addRectangle} className={styles.toolBtn}>
                        Add Rectangle
                    </button>
                    <button onClick={addCircle} className={styles.toolBtn}>
                        Add Circle
                    </button>
                    <button
                        onClick={deleteSelected}
                        className={styles.toolBtn}
                        style={{ backgroundColor: '#ef4444' }}
                    >
                        Delete
                    </button>
                </div>

                {/* Canvas */}
                <div className={styles.canvasWrapper}>
                    <canvas ref={canvasRef} className={styles.canvas} />
                </div>
            </div>
        </div>
    );
}
