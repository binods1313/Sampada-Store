// lib/markdown.js
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import yaml from 'js-yaml';

// Configure gray-matter to use the new js-yaml API
const customEngines = {
  yaml: {
    parse: yaml.load.bind(yaml),
    stringify: yaml.dump.bind(yaml)
  }
};

export async function markdownToHtml(markdown) {
  const { content, data } = matter(markdown, { engines: customEngines });
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return { html: processed.toString(), data };
}

// Keep the old functions for backwards compatibility
export function getMarkdownData(slug) {
  // This function is deprecated - use fs + markdownToHtml directly
  const fs = require('fs');
  const path = require('path');
  const fullPath = path.join(process.cwd(), 'content', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents, { engines: customEngines });
  return { frontMatter: data, markdownContent: content };
}
