import { useState } from 'react';
import { generateContent, getSampleProperty, saveHistory } from '../services/api';
import type { GeneratedContent, HistoryEntry, PropertyInput } from '../types';

interface UseGenerateReturn {
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
  generate: (property: PropertyInput) => Promise<void>;
  loadSample: () => Promise<PropertyInput | null>;
  clearError: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (property: PropertyInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateContent(property);
      setContent(result);

      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        property,
        content: result,
        createdAt: new Date().toISOString(),
      };

      await saveHistory(entry).catch(() => {
        // Non-critical: silently ignore history save failures
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = async (): Promise<PropertyInput | null> => {
    setError(null);
    try {
      return await getSampleProperty();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sample property');
      return null;
    }
  };

  const clearError = () => setError(null);

  return { content, isLoading, error, generate, loadSample, clearError };
}
