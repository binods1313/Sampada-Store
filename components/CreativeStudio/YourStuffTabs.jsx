import React, { useState } from 'react';
import { TemplateCard } from './TemplateCard'; // reuse existing component
import { DS } from '../designSystem'; // assume DS exported elsewhere or reuse same constants here

export default function YourStuffTabs() {
  const [activeTab, setActiveTab] = useState('Upload');
  const tabs = ['Upload', 'Design', 'Layout'];
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '6px 12px', borderRadius: 8,
              background: activeTab === t ? 'rgba(201,168,76,0.2)' : 'transparent',
              border: `1px solid ${DS.border}`,
              color: DS.cream,
            }}
          >{t}</button>
        ))}
      </div>
      {activeTab === 'Upload' && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: DS.creamDim }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⭳</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Upload your files</div>
          <div style={{ fontSize: 13 }}>Drag & drop or click to select files.</div>
        </div>
      )}
      {activeTab !== 'Upload' && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: DS.creamDim }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>{activeTab} view coming soon</div>
        </div>
      )}
    </div>
  );
}
