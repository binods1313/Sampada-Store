import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

// Simple Design System (should match DS from main file)
const DS = {
  bgCard: '#1C0D09',
  gold: '#C9A84C',
  goldDim: 'rgba(201,168,76,0.5)',
  cream: '#FAF6F0',
  creamDim: 'rgba(250,246,240,0.55)',
  border: 'rgba(201,168,76,0.13)',
  borderHov: 'rgba(201,168,76,0.38)',
  r8: 8,
  r10: 10,
  rFull: 9999,
  t15: 'all 0.15s ease',
  shadowCard: '0 2px 16px rgba(0,0,0,0.45)',
  shadowGold: '0 0 28px rgba(201,168,76,0.09)'
};

export default function CanvasEditor({ onBack }) {
  const [selectedTool, setSelectedTool] = useState('Select'); // Select, Text, Shape, Image, BG
  const canvasRef = useRef(null);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current, { backgroundColor: null });
    const link = document.createElement('a');
    link.download = 'sampada_design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const toolbarIcons = {
    Select: '✦',
    Text: 'T',
    Shape: '◈',
    Image: '↑',
    BG: '♢'
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: DS.bgCard, color: DS.cream, fontFamily: DS.fontBody }}>
      {/* Left Toolbar */}
      <div style={{ width: 50, borderRight: `1px solid ${DS.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12 }}>
        {Object.keys(toolbarIcons).map(tool => (
          <div
            key={tool}
            onClick={() => setSelectedTool(tool)}
            style={{
              marginBottom: 12,
              cursor: 'pointer',
              color: selectedTool === tool ? DS.gold : DS.creamDim,
              fontSize: 18,
              transition: DS.t15
            }}
          >
            {toolbarIcons[tool]}
          </div>
        ))}
      </div>

      {/* Canvas Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div
          ref={canvasRef}
          style={{
            width: 1080,
            height: 1080,
            background: '#2A1208',
            border: `1px solid ${DS.border}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Placeholder element to show selected tool */}
          <div style={{ position: 'absolute', top: 12, left: 12, color: DS.cream, fontSize: 14 }}>
            Tool: {selectedTool}
          </div>
        </div>
        {/* Top toolbar */}
        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => window.history.back()} style={{ padding: '6px 12px', borderRadius: DS.r8, background: DS.bgCard, color: DS.cream, border: `1px solid ${DS.border}` }}>← Back</button>
          <button onClick={() => console.log('Undo')} style={{ padding: '6px 12px', borderRadius: DS.r8, background: DS.bgCard, color: DS.cream, border: `1px solid ${DS.border}` }}>Undo</button>
          <button onClick={() => console.log('Redo')} style={{ padding: '6px 12px', borderRadius: DS.r8, background: DS.bgCard, color: DS.cream, border: `1px solid ${DS.border}` }}>Redo</button>
          <select style={{ padding: '6px 8px', borderRadius: DS.r8, background: DS.bgCard, color: DS.cream, border: `1px solid ${DS.border}` }}>
            <option>100 × 100</option>
            <option>500 × 500</option>
            <option>1080 × 1080</option>
          </select>
          <button onClick={handleDownload} style={{ padding: '6px 12px', borderRadius: DS.r8, background: DS.bgCard, color: DS.cream, border: `1px solid ${DS.border}` }}>Download</button>
        </div>
      </div>

      {/* Right Properties Panel */}
      <div style={{ width: 250, borderLeft: `1px solid ${DS.border}`, padding: 12 }}>
        <h3 style={{ margin: 0, marginBottom: 12, color: DS.gold }}>Properties</h3>
        {selectedTool === 'Text' && (
          <div>
            <div style={{ marginBottom: 8, color: DS.creamDim }}>Font size</div>
            <input type="range" min="12" max="72" defaultValue="24" style={{ width: '100%' }} />
          </div>
        )}
        {/* Additional dynamic controls can be added per tool */}
      </div>
    </div>
  );
}
