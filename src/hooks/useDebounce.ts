/**
 * @file hooks/useDebounce.ts
 * @purpose Debounce hook for delaying value updates
 * @layer utility
 * @deps none
 * @used-by [SearchFeature]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 90
 * @test-file useDebounce.test.ts
 * @test-status missing
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
