/**
 * AI-Powered Features API
 * 
 * Endpoints for:
 * - Product description generation
 * - Customer support chatbot
 * - SEO content generation
 * - General chat completion
 * 
 * Features:
 * - Automatic key rotation
 * - Automatic model fallback
 * - Model selection
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { chatCompletion, generateText, FREE_MODELS, FreeModel, MODEL_CONFIG } from '@/lib/openrouter';

interface AIRequest {
  action: 'generate-description' | 'chat' | 'seo' | 'summarize' | 'translate';
  input: string;
  context?: Record<string, unknown>;
  options?: {
    model?: FreeModel | string;
    temperature?: number;
    maxTokens?: number;
    enableModelFallback?: boolean;
    tier?: 1 | 2 | 3 | 4; // Auto-select model by tier
  };
}

interface AIResponse {
  success: boolean;
  content?: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

// Product description generator system prompt
const PRODUCT_DESCRIPTION_SYSTEM = `You are an expert e-commerce copywriter specializing in creating compelling product descriptions.

Your task is to write product descriptions that:
1. Highlight key features and benefits
2. Use persuasive, engaging language
3. Include relevant keywords for SEO
4. Are clear, concise, and scannable
5. Address customer pain points
6. Include a call-to-action when appropriate

Format your response with:
- A catchy headline (optional)
- Key features as bullet points
- A compelling closing paragraph

Keep the tone professional yet friendly. Focus on benefits, not just features.`;

// Customer support system prompt
const SUPPORT_SYSTEM = `You are a helpful customer support assistant for Sampada, an e-commerce store.

Your role is to:
1. Answer customer questions about products, orders, shipping, and returns
2. Be polite, professional, and empathetic
3. Provide accurate, helpful information
4. Escalate complex issues to human support when needed
5. Never make promises about delivery times, refunds, or policies you're unsure about

If you don't know something, say so and suggest contacting support directly.
Be concise but thorough in your responses.`;

// SEO content system prompt
const SEO_SYSTEM = `You are an SEO content specialist. Create optimized content that:
1. Naturally incorporates target keywords
2. Follows SEO best practices
3. Is readable and valuable for users
4. Uses proper heading structure
5. Includes meta descriptions when requested

Avoid keyword stuffing. Focus on user intent and quality content.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIResponse>
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { action, input, context, options }: AIRequest = req.body;

    // Validate input
    if (!action || !input) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: action, input' 
      });
    }

    let systemPrompt: string | undefined;
    let userPrompt: string;
    let temperature = options?.temperature ?? 0.7;

    // Handle different actions
    switch (action) {
      case 'generate-description':
        systemPrompt = PRODUCT_DESCRIPTION_SYSTEM;
        userPrompt = buildProductDescriptionPrompt(input, context);
        temperature = 0.8; // More creative for marketing copy
        break;

      case 'chat':
        systemPrompt = SUPPORT_SYSTEM;
        userPrompt = input;
        temperature = 0.7;
        break;

      case 'seo':
        systemPrompt = SEO_SYSTEM;
        userPrompt = buildSEOPrompt(input, context);
        temperature = 0.7;
        break;

      case 'summarize':
        userPrompt = `Please summarize the following text concisely while preserving key information:\n\n${input}`;
        temperature = 0.5; // More focused for summarization
        break;

      case 'translate':
        const targetLang = context?.targetLanguage || 'English';
        userPrompt = `Translate the following text to ${targetLang}. Maintain the original meaning and tone:\n\n${input}`;
        temperature = 0.6;
        break;

      default:
        return res.status(400).json({ 
          success: false, 
          error: `Unknown action: ${action}` 
        });
    }

    // Determine model to use
    let selectedModel: FreeModel | string = options?.model || FREE_MODELS.NEMOTRON_120B;
    
    // Auto-select model by tier if specified
    if (options?.tier) {
      const modelsByTier = Object.entries(MODEL_CONFIG)
        .filter(([_, config]) => config.tier === options.tier)
        .map(([modelId]) => modelId as FreeModel);
      selectedModel = modelsByTier[0] || FREE_MODELS.NEMOTRON_120B;
    }

    // Make the API call
    const response = await chatCompletion(
      [{ role: 'user', content: userPrompt }],
      {
        system: systemPrompt,
        model: selectedModel,
        temperature,
        maxTokens: options?.maxTokens || 1024,
        enableModelFallback: options?.enableModelFallback ?? true,
      }
    );

    return res.status(200).json({
      success: true,
      content: response.content,
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    console.error('[AI API] Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate AI response',
    });
  }
}

function buildProductDescriptionPrompt(
  productName: string,
  context?: Record<string, any>
): string {
  let prompt = `Write a compelling product description for: ${productName}`;

  if (context) {
    const details: string[] = [];
    
    if (context.features) {
      details.push(`Features: ${JSON.stringify(context.features)}`);
    }
    if (context.category) {
      details.push(`Category: ${context.category}`);
    }
    if (context.targetAudience) {
      details.push(`Target Audience: ${context.targetAudience}`);
    }
    if (context.priceRange) {
      details.push(`Price Range: ${context.priceRange}`);
    }
    if (context.keywords) {
      details.push(`SEO Keywords: ${JSON.stringify(context.keywords)}`);
    }
    if (context.tone) {
      details.push(`Tone: ${context.tone}`);
    }
    if (context.template) {
      details.push(`Style/Template: ${context.template}`);
    }
    if (context.length) {
      details.push(`Target Length: ${context.length} words`);
    }

    if (details.length > 0) {
      prompt += `\n\nAdditional context:\n${details.join('\n')}`;
    }
  }

  const length = context?.length || '150-200';
  const template = context?.template || 'standard';
  
  prompt += `\n\nWrite a ${template} product description (approx. ${length} words) that would convert browsers into buyers. Focus on being persuasive and highlight the unique value proposition.`;
  
  return prompt;
}

function buildSEOPrompt(
  topic: string,
  context?: Record<string, unknown>
): string {
  let prompt = `Create SEO-optimized content about: ${topic}`;

  if (context) {
    if (context.keywords) {
      prompt += `\nTarget Keywords: ${JSON.stringify(context.keywords)}`;
    }
    if (context.contentType) {
      prompt += `\nContent Type: ${context.contentType}`;
    }
    if (context.wordCount) {
      prompt += `\nTarget Word Count: ${context.wordCount}`;
    }
  }

  prompt += '\n\nCreate content that ranks well and provides genuine value to readers.';
  
  return prompt;
}
