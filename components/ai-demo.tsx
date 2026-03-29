/**
 * AI Tools Demo Component
 * 
 * A simple UI to test and demonstrate OpenRouter integration
 * - Product description generator
 * - Customer support chat
 * - General AI chat
 * - Model selection
 */

'use client';

import { useState } from 'react';
import { useProductDescription, useSupportChat, useAIGeneration } from '@/hooks/useAI';
import { FREE_MODELS, MODEL_CONFIG, FreeModel } from '@/lib/openrouter';
import { Sparkles, MessageCircle, Wand2, Send, Trash2, Copy, Check, Cpu, Zap } from 'lucide-react';

// Model tier badges
const TIER_COLORS = {
  1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  2: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  4: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export function AIDemo() {
  const [activeTab, setActiveTab] = useState<'description' | 'support' | 'chat'>('description');
  const [selectedModel, setSelectedModel] = useState<FreeModel>(FREE_MODELS.NEMOTRON_120B);
  const [selectedTier, setSelectedTier] = useState<number>(1);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                AI Tools Demo
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Powered by OpenRouter (Free API with Auto-Fallback)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">{MODEL_CONFIG[selectedModel].name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${TIER_COLORS[MODEL_CONFIG[selectedModel].tier as keyof typeof TIER_COLORS]}`}>
                Tier {MODEL_CONFIG[selectedModel].tier}
              </span>
            </div>
          </div>
        </div>

        {/* Model Selector */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Model:</span>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value as FreeModel);
                setSelectedTier(MODEL_CONFIG[e.target.value as FreeModel].tier);
              }}
              className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
            >
              {Object.entries(MODEL_CONFIG).map(([modelId, config]) => (
                <option key={modelId} value={modelId}>
                  {config.name} (Tier {config.tier})
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500">Quick Tier:</span>
              {[1, 2, 3, 4].map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setSelectedTier(tier);
                    const firstModel = Object.entries(MODEL_CONFIG)
                      .find(([_, config]) => config.tier === tier)?.[0] as FreeModel;
                    if (firstModel) setSelectedModel(firstModel);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    selectedTier === tier
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Tier {tier}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <strong>Tier 1:</strong> Best quality • <strong>Tier 2:</strong> Balanced • <strong>Tier 3:</strong> Fast • <strong>Tier 4:</strong> Ultra-fast
            <span className="ml-2 text-purple-600">✨ Auto-fallback enabled if model unavailable</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'description'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'support'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Support Chat
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            General Chat
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'description' && (
            <ProductDescriptionGenerator model={selectedModel} />
          )}
          {activeTab === 'support' && <SupportChat model={selectedModel} />}
          {activeTab === 'chat' && <GeneralChat model={selectedModel} />}
        </div>
      </div>
    </div>
  );
}

// Product Description Generator
function ProductDescriptionGenerator({ model }: { model: FreeModel }) {
  const { generate, loading, data, error } = useProductDescription({ model });
  const [productName, setProductName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    try {
      await generate(productName, {
        tone: 'professional yet friendly',
        keywords: ['quality', 'affordable', 'premium'],
      });
    } catch (err) {
      // Error already handled by hook
    }
  };

  const handleCopy = async () => {
    if (data) {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Premium Cotton T-Shirt"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !productName.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Generate
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          Generating with {MODEL_CONFIG[model].name}...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {data && (
        <div className="relative">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-gray-500">
                Generated with {MODEL_CONFIG[model].name}
              </span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{data}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Support Chat
function SupportChat({ model }: { model: FreeModel }) {
  const { messages, loading, error, sendMessage, clearChat } = useSupportChat({ model });
  const [input, setInput] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      // Error already handled by hook
    }
  };

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Start a conversation with our AI support assistant</p>
            <p className="text-xs mt-2">Using: {MODEL_CONFIG[model].name}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products, orders, shipping..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={clearChat}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

// General Chat
function GeneralChat({ model }: { model: FreeModel }) {
  const { generate, loading, data, error, reset } = useAIGeneration({ model });
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      await generate('chat', prompt);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Your Message</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          Thinking with {MODEL_CONFIG[model].name}...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {data && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-500">
              Response ({MODEL_CONFIG[model].name})
            </span>
            <button
              onClick={reset}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
            >
              Clear
            </button>
          </div>
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{data}</p>
        </div>
      )}
    </div>
  );
}
