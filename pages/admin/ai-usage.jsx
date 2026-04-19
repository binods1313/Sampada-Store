/**
 * Admin - AI Usage Dashboard
 * 
 * Features:
 * - Track API usage statistics
 * - Monitor token consumption
 * - View request history
 * - Cost estimation
 * - Model usage breakdown
 * - Rate limit monitoring
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { getApiKeyStats } from '@/lib/openrouter';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  RefreshCw,
  Calendar,
  Cpu,
  Hash
} from 'lucide-react';

export default function AIUsageDashboard() {
  return (
    <AdminLayout title="AI Usage Dashboard">
      <AIUsageContent />
    </AdminLayout>
  );
}

function AIUsageContent() {
  const [stats, setStats] = useState(null);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch API stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiKeyStats = getApiKeyStats();
        setStats(apiKeyStats);
        
        // Load usage history from localStorage
        const history = JSON.parse(localStorage.getItem('ai_usage_history') || '[]');
        setUsageHistory(history);
      } catch (err) {
        console.error('Error fetching AI stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Refresh stats
  const handleRefresh = () => {
    const apiKeyStats = getApiKeyStats();
    setStats(apiKeyStats);
    setLastRefresh(new Date());
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!stats) return { totalRequests: 0, totalFailures: 0, activeKeys: 0 };
    
    const values = Object.values(stats);
    return {
      totalRequests: values.reduce((sum, s) => sum + (s.failures || 0), 0),
      totalFailures: values.filter(s => s.failures > 0).length,
      activeKeys: values.filter(s => !s.cooldown).length,
    };
  };

  // Estimate costs (OpenRouter free models = $0, but track for future paid models)
  const estimateCosts = () => {
    const avgTokensPerRequest = 500; // Average estimate
    const totalTokens = (stats ? Object.values(stats).reduce((sum, s) => sum + (s.failures || 0), 0) : 0) * avgTokensPerRequest;
    
    // Rough estimate: $0.001 per 1K tokens for affordable models
    const estimatedCost = (totalTokens / 1000) * 0.001;
    
    return {
      totalTokens,
      estimatedCost: estimatedCost.toFixed(4),
      avgTokensPerRequest,
    };
  };

  const totals = calculateTotals();
  const costs = estimateCosts();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 'var(--admin-space-4, 16px)'
      }}>
        <RefreshCw className="w-8 h-8 animate-spin" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary, #888888)' }}>Loading AI usage statistics...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--admin-space-6, 24px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-heading" style={{ margin: '0 0 var(--admin-space-2, 8px) 0', fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary, #ffffff)' }}>
            AI Usage Dashboard
          </h1>
          <p className="admin-text-secondary" style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-secondary, #888888)' }}>
            Monitor AI API usage, token consumption, and costs
          </p>
        </div>
        <button
          onClick={handleRefresh}
          style={{
            padding: 'var(--admin-space-2, 10px) var(--admin-space-4, 16px)',
            backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
            color: 'var(--admin-gold, #C9A84C)',
            border: '1px solid var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))',
            borderRadius: 'var(--admin-radius-md, 8px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--admin-space-2, 8px)',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--admin-surface-5, #2a2a2a)';
            e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--admin-surface-2, #1a1a1a)';
            e.target.style.borderColor = 'var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))';
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Last Updated */}
      <div style={{
        marginBottom: 'var(--admin-space-6, 24px)',
        fontSize: '12px',
        color: 'var(--admin-text-muted, #666666)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--admin-space-1, 6px)'
      }}>
        <Clock className="w-3 h-3" />
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>

      {/* Stats Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--admin-space-4, 16px)',
        marginBottom: 'var(--admin-space-6, 24px)'
      }}>
        {/* Total Requests */}
        <div style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-5, 20px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))',
          boxShadow: 'var(--admin-shadow-sm, 0 2px 4px rgba(0,0,0,0.1))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)', marginBottom: 'var(--admin-space-3, 12px)' }}>
            <div style={{
              padding: 'var(--admin-space-2, 10px)',
              backgroundColor: 'var(--admin-bg-selected, rgba(201, 168, 76, 0.15))',
              borderRadius: 'var(--admin-radius-md, 8px)'
            }}>
              <Activity className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>Total Requests</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary, #ffffff)' }}>
                {totals.totalRequests}
              </div>
            </div>
          </div>
        </div>

        {/* Active API Keys */}
        <div style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-5, 20px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))',
          boxShadow: 'var(--admin-shadow-sm, 0 2px 4px rgba(0,0,0,0.1))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)', marginBottom: 'var(--admin-space-3, 12px)' }}>
            <div style={{
              padding: 'var(--admin-space-2, 10px)',
              backgroundColor: 'var(--admin-success-subtle, rgba(45, 122, 45, 0.15))',
              borderRadius: 'var(--admin-radius-md, 8px)'
            }}>
              <CheckCircle className="w-5 h-5" style={{ color: 'var(--admin-success, #2d7a2d)' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>Active API Keys</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-success, #2d7a2d)' }}>
                {totals.activeKeys} / 3
              </div>
            </div>
          </div>
        </div>

        {/* Tokens Consumed */}
        <div style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-5, 20px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))',
          boxShadow: 'var(--admin-shadow-sm, 0 2px 4px rgba(0,0,0,0.1))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)', marginBottom: 'var(--admin-space-3, 12px)' }}>
            <div style={{
              padding: 'var(--admin-space-2, 10px)',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              borderRadius: 'var(--admin-radius-md, 8px)'
            }}>
              <Cpu className="w-5 h-5" style={{ color: '#6366f1' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>Tokens Consumed</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1' }}>
                {costs.totalTokens.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Cost */}
        <div style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-5, 20px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))',
          boxShadow: 'var(--admin-shadow-sm, 0 2px 4px rgba(0,0,0,0.1))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)', marginBottom: 'var(--admin-space-3, 12px)' }}>
            <div style={{
              padding: 'var(--admin-space-2, 10px)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              borderRadius: 'var(--admin-radius-md, 8px)'
            }}>
              <DollarSign className="w-5 h-5" style={{ color: '#10b981' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>Estimated Cost</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
                ${costs.estimatedCost}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Status */}
      <section style={{
        backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
        borderRadius: 'var(--admin-radius-xl, 12px)',
        padding: 'var(--admin-space-6, 24px)',
        marginBottom: 'var(--admin-space-6, 24px)',
        border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', marginBottom: 'var(--admin-space-5, 20px)', display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 8px)' }}>
          <BarChart3 className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
          API Key Status
        </h2>

        {stats && Object.keys(stats).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-3, 12px)' }}>
            {Object.entries(stats).map(([keyPrefix, data]) => (
              <div
                key={keyPrefix}
                style={{
                  padding: 'var(--admin-space-4, 16px)',
                  backgroundColor: 'var(--admin-surface-1, #141414)',
                  borderRadius: 'var(--admin-radius-lg, 10px)',
                  border: `1px solid ${data.cooldown ? 'rgba(255, 107, 107, 0.3)' : 'var(--admin-gold-border, rgba(201, 168, 76, 0.15))'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)' }}>
                  <Hash className="w-4 h-4" style={{ color: 'var(--admin-text-secondary, #888888)' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', fontFamily: 'monospace' }}>
                      {keyPrefix}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>
                      {data.failures} failures
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)' }}>
                  {data.cooldown ? (
                    <>
                      <div style={{
                        padding: 'var(--admin-space-1, 6px) var(--admin-space-3, 12px)',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderRadius: 'var(--admin-radius-sm, 6px)',
                        fontSize: '12px',
                        color: 'var(--admin-error-text, #ff6b6b)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--admin-space-1, 6px)',
                      }}>
                        <AlertTriangle className="w-3 h-3" />
                        Cooldown: {data.cooldown}s
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{
                        padding: 'var(--admin-space-1, 6px) var(--admin-space-3, 12px)',
                        backgroundColor: 'var(--admin-success-subtle, rgba(45, 122, 45, 0.1))',
                        borderRadius: 'var(--admin-radius-sm, 6px)',
                        fontSize: '12px',
                        color: 'var(--admin-success, #2d7a2d)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--admin-space-1, 6px)',
                      }}>
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: 'var(--admin-space-8, 32px)',
            textAlign: 'center',
            color: 'var(--admin-text-secondary, #888888)',
            fontSize: '14px'
          }}>
            <Zap className="w-12 h-12" style={{ color: 'var(--admin-text-muted, #666666)', margin: '0 auto var(--admin-space-3, 12px)' }} />
            <p>No API usage data yet. Start using AI features to see statistics.</p>
          </div>
        )}
      </section>

      {/* Usage History */}
      <section style={{
        backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
        borderRadius: 'var(--admin-radius-xl, 12px)',
        padding: 'var(--admin-space-6, 24px)',
        marginBottom: 'var(--admin-space-6, 24px)',
        border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', marginBottom: 'var(--admin-space-5, 20px)', display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 8px)' }}>
          <Calendar className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
          Recent Usage History
        </h2>

        {usageHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-3, 12px)' }}>
            {usageHistory.slice(-10).reverse().map((entry, index) => (
              <div
                key={index}
                style={{
                  padding: 'var(--admin-space-4, 16px)',
                  backgroundColor: 'var(--admin-surface-1, #141414)',
                  borderRadius: 'var(--admin-radius-lg, 10px)',
                  border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.15))',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--admin-space-2, 8px)' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)' }}>
                    {entry.action}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--admin-space-4, 16px)', fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>
                  <span>Model: {entry.model}</span>
                  <span>Tokens: {entry.tokens?.total || 0}</span>
                  <span>Status: <span style={{ color: entry.success ? 'var(--admin-success, #2d7a2d)' : 'var(--admin-error-text, #ff6b6b)' }}>
                    {entry.success ? 'Success' : 'Failed'}
                  </span></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: 'var(--admin-space-8, 32px)',
            textAlign: 'center',
            color: 'var(--admin-text-secondary, #888888)',
            fontSize: '14px'
          }}>
            <PieChart className="w-12 h-12" style={{ color: 'var(--admin-text-muted, #666666)', margin: '0 auto var(--admin-space-3, 12px)' }} />
            <p>No usage history recorded yet.</p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section style={{
        backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
        borderRadius: 'var(--admin-radius-xl, 12px)',
        padding: 'var(--admin-space-6, 24px)',
        border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', marginBottom: 'var(--admin-space-5, 20px)' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--admin-space-3, 12px)' }}>
          <button
            onClick={() => {
              localStorage.removeItem('ai_usage_history');
              setUsageHistory([]);
              toast.success('Usage history cleared');
            }}
            style={{
              padding: 'var(--admin-space-4, 14px)',
              backgroundColor: 'var(--admin-surface-1, #141414)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              borderRadius: 'var(--admin-radius-lg, 10px)',
              color: 'var(--admin-error-text, #ff6b6b)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--admin-space-2, 8px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
              e.target.style.borderColor = 'var(--admin-error-text, #ff6b6b)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--admin-surface-1, #141414)';
              e.target.style.borderColor = 'rgba(255, 107, 107, 0.2)';
            }}
          >
            <AlertTriangle className="w-5 h-5" />
            Clear History
          </button>

          <button
            onClick={() => router.push('/admin/products/add')}
            style={{
              padding: 'var(--admin-space-4, 14px)',
              backgroundColor: 'var(--admin-surface-1, #141414)',
              border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
              borderRadius: 'var(--admin-radius-lg, 10px)',
              color: 'var(--admin-gold, #C9A84C)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--admin-space-2, 8px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--admin-bg-hover, rgba(201, 168, 76, 0.1))';
              e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--admin-surface-1, #141414)';
              e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
            }}
          >
            <Zap className="w-5 h-5" />
            Add Product
          </button>

          <button
            onClick={() => router.push('/admin/seo/bulk-generate')}
            style={{
              padding: 'var(--admin-space-4, 14px)',
              backgroundColor: 'var(--admin-surface-1, #141414)',
              border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
              borderRadius: 'var(--admin-radius-lg, 10px)',
              color: 'var(--admin-gold, #C9A84C)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--admin-space-2, 8px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--admin-bg-hover, rgba(201, 168, 76, 0.1))';
              e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--admin-surface-1, #141414)';
              e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
            }}
          >
            <TrendingUp className="w-5 h-5" />
            Bulk SEO
          </button>
        </div>
      </section>
    </>
  );
}
