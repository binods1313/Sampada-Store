/**
 * AI Demo Page
 * Test and demo UI for OpenRouter integration
 */

import { AIDemo } from '@/components/ai-demo';

export default function AIDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Tools Demo
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Powered by OpenRouter Free API
          </p>
        </div>
        <AIDemo />
      </div>
    </div>
  );
}
