import { useState, useCallback } from 'react';
import { ApiError, apiService } from '../services/api';
import type { PropertyInput, GeneratedOutput, HistoryItem, UsageGateResult, UsageSummary } from '../types';

interface UseGeneratorReturn {
  output: GeneratedOutput | null;
  usage: UsageSummary | null;
  isLoading: boolean;
  error: string | null;
  generate: (property: PropertyInput, usageScope?: 'demo' | 'workspace') => Promise<void>;
  reset: () => void;
}

export function useGenerator(): UseGeneratorReturn {
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (property: PropertyInput, usageScope: 'demo' | 'workspace' = 'workspace') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.generate(property, usageScope);
      setOutput(response.result?.output ?? null);
      setUsage(response.usage);
    } catch (err) {
      if (err instanceof ApiError && err.status === 402 && err.payload && typeof err.payload === 'object') {
        const gate = err.payload as Partial<UsageGateResult>;
        if (gate.summary) {
          setUsage(gate.summary);
        }
        setError(gate.reason || 'Usage limit reached. Upgrade to continue generating.');
        return;
      }

      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setOutput(null);
    setUsage(null);
    setError(null);
  }, []);

  return { output, usage, isLoading, error, generate, reset };
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
