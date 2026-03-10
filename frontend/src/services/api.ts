import type { GeneratedContent, HistoryEntry, PropertyInput } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export async function generateContent(property: PropertyInput): Promise<GeneratedContent> {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
  });

  if (!response.ok) {
    throw new Error(`Generate request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getSampleProperty(): Promise<PropertyInput> {
  const response = await fetch(`${API_URL}/api/sample-property`);

  if (!response.ok) {
    throw new Error(`Failed to fetch sample property: ${response.status}`);
  }

  return response.json();
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_URL}/api/history`);

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.status}`);
  }

  return response.json();
}

export async function saveHistory(entry: HistoryEntry): Promise<void> {
  const response = await fetch(`${API_URL}/api/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error(`Failed to save history: ${response.status}`);
  }
}
