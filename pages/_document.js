// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/* 
          CRITICAL: Set theme BEFORE React hydrates to prevent flash (FOUC)
          This script runs synchronously before any React code, ensuring the 
          correct theme class is applied to <html> element immediately.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get theme from localStorage or system preference
                  const savedTheme = localStorage.getItem('theme');
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
                  
                  // Apply theme class immediately
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // Store for React to read on mount
                  window.__INITIAL_THEME__ = theme;
                } catch (e) {
                  // Fallback to light theme if anything fails
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
