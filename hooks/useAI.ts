/**
 * React Hooks for OpenRouter AI Integration
 * 
 * Features:
 * - Automatic key rotation
 * - Automatic model fallback
 * - Model selection support
 */

import { useState, useCallback } from 'react';
import { FREE_MODELS, FreeModel, MODEL_CONFIG } from '@/lib/openrouter';

interface UseAIOptions {
  model?: FreeModel | string;
  temperature?: number;
  maxTokens?: number;
  enableModelFallback?: boolean;
}

interface AIState<T = unknown> {
  loading: boolean;
  data: T | null;
  error: string | null;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Hook for generating product descriptions
 */
export function useProductDescription(options?: UseAIOptions) {
  const [state, setState] = useState<AIState<string>>({
    loading: false,
    data: null,
    error: null,
  });

  const generate = useCallback(async (
    productName: string,
    context?: {
      features?: string[];
      category?: string;
      targetAudience?: string;
      priceRange?: string;
      keywords?: string[];
      tone?: string;
      template?: string;
      length?: string;
    }
  ) => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-description',
          input: productName,
          context,
          options,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate description');
      }

      setState({
        loading: false,
        data: data.content,
        error: null,
        model: data.model,
        usage: data.usage,
      });

      return data.content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate description';
      setState(s => ({
        loading: false,
        data: null,
        error: errorMessage,
      }));
      throw error;
    }
  }, [options]);

  return { ...state, generate };
}

/**
 * Hook for customer support chat
 */
export function useSupportChat(options?: UseAIOptions) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setLoading(true);
    setError(null);

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          input: message,
          options,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

      return data.content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}

/**
 * Generic hook for AI text generation
 */
export function useAIGeneration(options?: UseAIOptions) {
  const [state, setState] = useState<AIState<string>>({
    loading: false,
    data: null,
    error: null,
  });

  const generate = useCallback(async (
    action: 'generate-description' | 'chat' | 'seo' | 'summarize' | 'translate',
    input: string,
    context?: Record<string, unknown>
  ) => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          input,
          context,
          options,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setState({
        loading: false,
        data: data.content,
        error: null,
        model: data.model,
        usage: data.usage,
      });

      return data.content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      setState(s => ({
        loading: false,
        data: null,
        error: errorMessage,
      }));
      throw error;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      data: null,
      error: null,
    });
  }, []);

  return { ...state, generate, reset };
}
