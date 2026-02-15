// lib/kiroClient.js
/**
 * Client-side helper for accessing Kiro powers and skills
 * Use this in React components and client-side code
 */

export class KiroClient {
  constructor() {
    this.baseUrl = '/api/kiro/registry';
  }

  /**
   * Get all powers
   */
  async getPowers() {
    const response = await fetch(`${this.baseUrl}?type=powers`);
    if (!response.ok) throw new Error('Failed to fetch powers');
    return response.json();
  }

  /**
   * Get all skills
   */
  async getSkills() {
    const response = await fetch(`${this.baseUrl}?type=skills`);
    if (!response.ok) throw new Error('Failed to fetch skills');
    return response.json();
  }

  /**
   * Get a specific power or skill by name
   */
  async get(name) {
    const response = await fetch(`${this.baseUrl}?name=${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error(`Failed to fetch ${name}`);
    return response.json();
  }

  /**
   * Get runtime stats
   */
  async getStats() {
    const response = await fetch(`${this.baseUrl}?type=stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }

  /**
   * Get all registry data
   */
  async getAll() {
    const response = await fetch(this.baseUrl);
    if (!response.ok) throw new Error('Failed to fetch registry');
    return response.json();
  }

  /**
   * Execute a power or skill function
   */
  async execute(path, ...args) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'execute', path, args })
    });
    if (!response.ok) throw new Error('Failed to execute');
    return response.json();
  }
}

// Singleton instance
let clientInstance = null;

export function getKiroClient() {
  if (!clientInstance) {
    clientInstance = new KiroClient();
  }
  return clientInstance;
}

// Default export
export default getKiroClient;
