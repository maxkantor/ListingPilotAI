import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { PropertyInput, GeneratedOutput, HistoryItem } from '../types';

interface UseGeneratorReturn {
  output: GeneratedOutput | null;
  isLoading: boolean;
  error: string | null;
  generate: (property: PropertyInput) => Promise<void>;
  reset: () => void;
}

export function useGenerator(): UseGeneratorReturn {
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (property: PropertyInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.generate(property);
      setOutput(result.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setOutput(null);
    setError(null);
  }, []);

  return { output, isLoading, error, generate, reset };
}

interface UseHistoryReturn {
  history: HistoryItem[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getHistory();
      setHistory(data);
    } catch {
      // silently fail for history
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { history, isLoading, refresh };
}
