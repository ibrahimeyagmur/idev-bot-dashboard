import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 30000; // 30 seconds

interface UseCachedFetchOptions {
  enabled?: boolean;
  ttl?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export function useCachedFetch<T>(
  url: string | null,
  options: UseCachedFetchOptions = {}
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { enabled = true, ttl = CACHE_TTL, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    if (!url || !enabled) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    if (!skipCache) {
      const cached = cache.get(url) as CacheEntry<T> | undefined;
      if (cached && Date.now() - cached.timestamp < ttl) {
        setData(cached.data);
        setIsLoading(false);
        onSuccess?.(cached.data);
        return;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        credentials: 'include',
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait and retry
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          console.warn(`Rate limited. Waiting ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return fetchData(skipCache);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      cache.set(url, { data: result, timestamp: Date.now() });
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
        onError?.(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled, ttl, onSuccess, onError]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

// Clear cache for a specific URL pattern
export function clearCache(pattern?: string): void {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}
