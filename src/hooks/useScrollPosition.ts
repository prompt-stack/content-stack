import { useRef, useCallback, useEffect } from 'react';

interface ScrollPosition {
  top: number;
  left: number;
}

interface UseScrollPositionOptions {
  storageKey?: string;
  debounceMs?: number;
  restoreOnMount?: boolean;
}

export function useScrollPosition(options: UseScrollPositionOptions = {}) {
  const {
    storageKey,
    debounceMs = 100,
    restoreOnMount = true
  } = options;

  const scrollElementRef = useRef<HTMLElement | null>(null);
  const scrollPositionRef = useRef<ScrollPosition>({ top: 0, left: 0 });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save scroll position to ref and optionally to storage
  const saveScrollPosition = useCallback(() => {
    if (!scrollElementRef.current) return;

    const position: ScrollPosition = {
      top: scrollElementRef.current.scrollTop,
      left: scrollElementRef.current.scrollLeft
    };

    scrollPositionRef.current = position;

    if (storageKey) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(position));
      } catch (e) {
        console.warn('Failed to save scroll position:', e);
      }
    }
  }, [storageKey]);

  // Debounced save function
  const debouncedSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveScrollPosition();
    }, debounceMs);
  }, [saveScrollPosition, debounceMs]);

  // Restore scroll position from ref or storage
  const restoreScrollPosition = useCallback(() => {
    if (!scrollElementRef.current) return;

    let position = scrollPositionRef.current;

    if (storageKey) {
      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          position = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to restore scroll position:', e);
      }
    }

    scrollElementRef.current.scrollTop = position.top;
    scrollElementRef.current.scrollLeft = position.left;
  }, [storageKey]);

  // Scroll to top
  const scrollToTop = useCallback((smooth = true) => {
    if (!scrollElementRef.current) return;

    if (smooth && 'scrollBehavior' in document.documentElement.style) {
      scrollElementRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      scrollElementRef.current.scrollTop = 0;
      scrollElementRef.current.scrollLeft = 0;
    }

    saveScrollPosition();
  }, [saveScrollPosition]);

  // Scroll to specific position
  const scrollTo = useCallback((position: Partial<ScrollPosition>, smooth = true) => {
    if (!scrollElementRef.current) return;

    const currentPosition = {
      top: scrollElementRef.current.scrollTop,
      left: scrollElementRef.current.scrollLeft
    };

    const newPosition = {
      ...currentPosition,
      ...position
    };

    if (smooth && 'scrollBehavior' in document.documentElement.style) {
      scrollElementRef.current.scrollTo({
        ...newPosition,
        behavior: 'smooth'
      });
    } else {
      if (position.top !== undefined) {
        scrollElementRef.current.scrollTop = newPosition.top;
      }
      if (position.left !== undefined) {
        scrollElementRef.current.scrollLeft = newPosition.left;
      }
    }

    saveScrollPosition();
  }, [saveScrollPosition]);

  // Set ref and attach scroll listener
  const setScrollElement = useCallback((element: HTMLElement | null) => {
    // Remove listener from old element
    if (scrollElementRef.current) {
      scrollElementRef.current.removeEventListener('scroll', debouncedSave);
    }

    scrollElementRef.current = element;

    // Add listener to new element
    if (element) {
      element.addEventListener('scroll', debouncedSave, { passive: true });

      // Restore position on mount if enabled
      if (restoreOnMount) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          restoreScrollPosition();
        });
      }
    }
  }, [debouncedSave, restoreScrollPosition, restoreOnMount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (scrollElementRef.current) {
        scrollElementRef.current.removeEventListener('scroll', debouncedSave);
      }
    };
  }, [debouncedSave]);

  return {
    setScrollElement,
    saveScrollPosition,
    restoreScrollPosition,
    scrollToTop,
    scrollTo,
    scrollPosition: scrollPositionRef.current
  };
}