/**
 * OpenRouter API Client with Key Rotation
 * 
 * Provides reliable AI integration with automatic failover between API keys
 */

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Free models available on OpenRouter
 * Organized by quality/performance tier
 * 
 * Note: Free model availability changes frequently.
 * Check: https://openrouter.ai/models?query=free
 * 
 * CONFIRMED WORKING (as of latest test):
 * - nvidia/nemotron-3-super-120b-a12b:free ✅
 */
export const FREE_MODELS = {
  /**
   * Tier 1: Best Quality (Recommended for production)
   * ✅ CONFIRMED WORKING
   */
  NEMOTRON_120B: 'nvidia/nemotron-3-super-120b-a12b:free',
  
  /**
   * Tier 2: Good Quality (Balanced speed/quality)
   * ⚠️ Check availability before use
   */
  // DEEPSEEK_R1: 'deepseek/deepseek-r1-distill-llama-70b:free',
  // QWEN_2_5_72B: 'qwen/qwen-2.5-72b-instruct:free',
  
  /**
   * Tier 3: Fast (Good for quick tasks)
   * ⚠️ Check availability before use
   */
  // Llama_3_1_8B: 'meta-llama/llama-3-1-8b-instruct:free',
  // GEMMA_2_9B: 'google/gemma-2-9b-it:free',
  // MISTRAL_7B: 'mistralai/mistral-7b-instruct:free',
  
  /**
   * Tier 4: Ultra Fast (Simple tasks only)
   * ⚠️ Check availability before use
   */
  // Llama_3_2_1B: 'meta-llama/llama-3-2-1b-instruct:free',
  // QWEN_2_5_3B: 'qwen/qwen-2.5-3b-instruct:free',
} as const;

export type FreeModel = typeof FREE_MODELS[keyof typeof FREE_MODELS];

/**
 * Model configurations with priorities and fallbacks
 * Only includes confirmed working models
 */
export const MODEL_CONFIG: Record<FreeModel, { 
  name: string; 
  tier: number; 
  maxTokens: number;
  contextWindow: number;
  bestFor: string[];
  status: 'working' | 'unavailable';
}> = {
  'nvidia/nemotron-3-super-120b-a12b:free': {
    name: 'NVIDIA Nemotron 120B',
    tier: 1,
    maxTokens: 4096,
    contextWindow: 128000,
    bestFor: ['complex-reasoning', 'creative-writing', 'code-generation', 'product-descriptions'],
    status: 'working',
  },
};

// Default model to use
export const DEFAULT_MODEL = FREE_MODELS.NEMOTRON_120B;

/**
 * Get fallback models in order of quality
 */
export function getFallbackModels(currentModel?: FreeModel): FreeModel[] {
  const allModels = Object.values(FREE_MODELS) as FreeModel[];

  if (!currentModel) {
    return allModels;
  }

  const currentTier = MODEL_CONFIG[currentModel]?.tier || 999;

  // Sort by tier, then exclude current model
  return allModels
    .filter(m => m !== currentModel)
    .sort((a, b) => MODEL_CONFIG[a].tier - MODEL_CONFIG[b].tier);
}

/**
 * Get best model for a specific use case
 */
export function getBestModelFor(useCase: string): FreeModel {
  const entries = Object.entries(MODEL_CONFIG) as [FreeModel, typeof MODEL_CONFIG[FreeModel]][];

  // Find model that lists this use case
  const match = entries.find(([_, config]) =>
    config.bestFor.some(b => b.toLowerCase().includes(useCase.toLowerCase()))
  );

  return match ? match[0] : DEFAULT_MODEL;
}

/**
 * Get all available free models from OpenRouter API
 * This dynamically fetches currently available free models
 */
export async function getAvailableFreeModels(): Promise<Array<{
  id: string;
  name: string;
  context_length: number;
  pricing: { prompt: number; completion: number };
}>> {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.warn('[OpenRouter] Failed to fetch models list');
      return Object.values(MODEL_CONFIG).map((config, idx) => ({
        id: Object.keys(FREE_MODELS)[idx] as string,
        name: config.name,
        context_length: config.contextWindow,
        pricing: { prompt: 0, completion: 0 },
      }));
    }

    const data = await response.json();
    
    // Filter for free models only
    return data.data.filter((model: any) => 
      model.pricing?.prompt === 0 && model.pricing?.completion === 0
    );
  } catch (error) {
    console.error('[OpenRouter] Error fetching models:', error);
    // Return configured models as fallback
    return Object.values(MODEL_CONFIG).map((config, idx) => ({
      id: Object.keys(FREE_MODELS)[idx] as string,
      name: config.name,
      context_length: config.contextWindow,
      pricing: { prompt: 0, completion: 0 },
    }));
  }
}

/**
 * Check if a specific model is available
 */
export async function isModelAvailable(modelId: string): Promise<boolean> {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    if (!response.ok) return true; // Assume available if we can't check

    const data = await response.json();
    return data.data.some((m: any) => m.id === modelId);
  } catch {
    return true; // Assume available on error
  }
}

// API Key rotation pool
class ApiKeyRotator {
  private keys: string[];
  private currentIndex = 0;
  private failedCounts: Map<string, number> = new Map();
  private cooldowns: Map<string, number> = new Map();

  constructor(keys: string[]) {
    this.keys = keys.filter(Boolean);
    if (this.keys.length === 0) {
      throw new Error('No valid API keys provided');
    }
    this.keys.forEach(key => this.failedCounts.set(key, 0));
  }

  getCurrentKey(): string {
    return this.keys[this.currentIndex];
  }

  rotateKey(): boolean {
    const currentKey = this.keys[this.currentIndex];
    const failures = this.failedCounts.get(currentKey) || 0;
    
    // Mark current key as failed
    this.failedCounts.set(currentKey, failures + 1);
    
    // Find next available key
    const startIndex = this.currentIndex;
    do {
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      const nextKey = this.keys[this.currentIndex];
      const cooldown = this.cooldowns.get(nextKey);
      
      // Check if key is in cooldown
      if (cooldown && Date.now() < cooldown) {
        continue;
      }
      
      // Reset failure count for successful rotation
      this.failedCounts.set(nextKey, 0);
      return true;
    } while (this.currentIndex !== startIndex);
    
    // All keys exhausted
    return false;
  }

  markKeyFailed(key: string, retryAfter?: number): void {
    const cooldownMs = retryAfter ? retryAfter * 1000 : 60000; // Default 1 min cooldown
    this.cooldowns.set(key, Date.now() + cooldownMs);
  }

  getStats(): Record<string, { failures: number; cooldown?: number }> {
    const stats: Record<string, { failures: number; cooldown?: number }> = {};
    const now = Date.now();
    
    this.keys.forEach(key => {
      const cooldown = this.cooldowns.get(key);
      stats[key.substring(0, 12) + '...'] = {
        failures: this.failedCounts.get(key) || 0,
        cooldown: cooldown && cooldown > now ? Math.round((cooldown - now) / 1000) : undefined,
      };
    });
    
    return stats;
  }
}

// Initialize API key rotator
let keyRotator: ApiKeyRotator | null = null;

export function initializeOpenRouter(keys?: string[]): void {
  const apiKeyList = keys || [
    process.env.OPENROUTER_API_KEY_1,
    process.env.OPENROUTER_API_KEY_2,
    process.env.OPENROUTER_API_KEY_3,
  ].filter(Boolean);

  if (apiKeyList.length > 0) {
    keyRotator = new ApiKeyRotator(apiKeyList);
  }
}

// Fallback to single key from env
function getApiKey(): string | null {
  if (keyRotator) {
    return keyRotator.getCurrentKey();
  }
  return process.env.OPENROUTER_API_KEY || null;
}

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  system?: string;
  enableModelFallback?: boolean; // Try other models if current fails
}

interface OpenRouterResponse {
  id: string;
  model: string;
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Make a request to OpenRouter with automatic key and model fallback
 */
async function makeRequest(
  messages: OpenRouterMessage[],
  options: OpenRouterOptions = {},
  retryCount = 0,
  attemptedModels: string[] = []
): Promise<OpenRouterResponse> {
  const maxRetries = 3;
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('No OpenRouter API key configured');
  }

  const model = options.model || DEFAULT_MODEL;
  const enableModelFallback = options.enableModelFallback ?? true;

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        'X-Title': 'Sampada-Store',
      },
      body: JSON.stringify({
        model,
        messages: options.system
          ? [{ role: 'system', content: options.system }, ...messages]
          : messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: (options.maxTokens ?? MODEL_CONFIG[model as FreeModel]?.maxTokens) || 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || 'Unknown error';
      
      // Handle rate limiting - rotate key and retry
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        
        if (keyRotator) {
          keyRotator.markKeyFailed(apiKey, retryAfter);
          keyRotator.rotateKey();
          
          if (retryCount < maxRetries) {
            console.log(`[OpenRouter] Rate limited on key. Rotated. Retry ${retryCount + 1}/${maxRetries}`);
            return makeRequest(messages, options, retryCount + 1, attemptedModels);
          }
        }
        
        throw new Error(`Rate limited. Try again in ${retryAfter} seconds`);
      }

      // Handle authentication errors - rotate key and retry
      if (response.status === 401 || response.status === 403) {
        if (keyRotator) {
          keyRotator.markKeyFailed(apiKey, 300); // 5 min cooldown
          keyRotator.rotateKey();
          
          if (retryCount < maxRetries) {
            console.log(`[OpenRouter] Auth failed. Rotated key. Retry ${retryCount + 1}/${maxRetries}`);
            return makeRequest(messages, options, retryCount + 1, attemptedModels);
          }
        }
      }

      // Handle model not found - try fallback models
      if (response.status === 400 && errorMessage.includes('not a valid model')) {
        console.warn(`[OpenRouter] Model ${model} not available.`);
        
        if (enableModelFallback) {
          const fallbackModels = getFallbackModels(model as FreeModel);
          
          for (const fallbackModel of fallbackModels) {
            if (attemptedModels.includes(fallbackModel)) {
              continue; // Skip already attempted models
            }
            
            console.log(`[OpenRouter] Trying fallback model: ${MODEL_CONFIG[fallbackModel].name}`);
            return makeRequest(
              messages, 
              { ...options, model: fallbackModel, enableModelFallback: false }, 
              0, 
              [...attemptedModels, model]
            );
          }
        }
        
        throw new Error(`Model ${model} not available and no fallbacks succeeded`);
      }

      throw new Error(`OpenRouter API error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      model: data.model,
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  } catch (error) {
    // Network errors or other failures - rotate key and retry
    if (error instanceof Error && !error.message.includes('OpenRouter')) {
      if (keyRotator) {
        keyRotator.rotateKey();
        
        if (retryCount < maxRetries) {
          console.log(`[OpenRouter] Network error. Rotated key. Retry ${retryCount + 1}/${maxRetries}`);
          return makeRequest(messages, options, retryCount + 1, attemptedModels);
        }
      }
    }
    throw error;
  }
}

/**
 * Send a chat completion request to OpenRouter
 */
export async function chatCompletion(
  messages: OpenRouterMessage[],
  options: OpenRouterOptions = {}
): Promise<OpenRouterResponse> {
  return makeRequest(messages, options);
}

/**
 * Simple single-message completion helper
 */
export async function generateText(
  prompt: string,
  options: OpenRouterOptions & { system?: string } = {}
): Promise<string> {
  const response = await chatCompletion(
    [{ role: 'user', content: prompt }],
    options
  );
  return response.content;
}

/**
 * Get API key rotation stats (for debugging)
 */
export function getApiKeyStats(): Record<string, { failures: number; cooldown?: number }> | null {
  return keyRotator?.getStats() || null;
}

// Auto-initialize on import
if (typeof window === 'undefined') {
  initializeOpenRouter();
}
