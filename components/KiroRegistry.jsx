// components/KiroRegistry.jsx
/**
 * React component to display Kiro Powers and Skills
 * Demonstrates client-side access to the runtime registry
 */

import React, { useState, useEffect } from 'react';
import { getKiroClient } from '../lib/kiroClient';

const KiroRegistry = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('powers');

  useEffect(() => {
    loadRegistry();
  }, []);

  const loadRegistry = async () => {
    try {
      setLoading(true);
      const client = getKiroClient();
      const registryData = await client.getAll();
      setData(registryData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading Kiro Registry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>Error Loading Registry</h3>
        <p>{error}</p>
        <button onClick={loadRegistry}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { powers, skills, stats, conflicts } = data;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>🚀 Kiro Runtime Registry</h1>
      
      {/* Stats */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3' }}>
            {stats.powers}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Powers</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7928ca' }}>
            {stats.skills}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Skills</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: stats.conflicts > 0 ? '#ff0080' : '#00c853' }}>
            {stats.conflicts}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Conflicts</div>
        </div>
      </div>

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Naming Conflicts</h3>
          {conflicts.map((conflict, i) => (
            <div key={i} style={{ marginBottom: '5px', fontSize: '14px' }}>
              <strong>{conflict.name}</strong>: {conflict.resolution}
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee' }}>
        <button
          onClick={() => setActiveTab('powers')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'powers' ? '3px solid #0070f3' : 'none',
            fontWeight: activeTab === 'powers' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Powers ({powers.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'skills' ? '3px solid #7928ca' : 'none',
            fontWeight: activeTab === 'skills' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Skills ({skills.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'powers' && (
        <div>
          {powers.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
              No powers loaded
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {powers.map(power => (
                <div key={power.name} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>
                    {power.displayName || power.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    {power.description || 'No description available'}
                  </p>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    <div>Version: {power.version}</div>
                    {power.capabilities && power.capabilities.length > 0 && (
                      <div>Capabilities: {power.capabilities.length}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'skills' && (
        <div>
          {skills.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
              No skills loaded
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {skills.map(skill => (
                <div key={skill.name} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#7928ca' }}>
                    {skill.displayName || skill.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    {skill.description || 'No description available'}
                  </p>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    <div>Files: {skill.files ? skill.files.length : 0}</div>
                    <div>Type: {skill.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KiroRegistry;
