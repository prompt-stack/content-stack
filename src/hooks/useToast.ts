/**
 * @file hooks/useToast.ts
 * @purpose Hook for managing toast notifications
 * @layer hooks
 * @deps []
 * @used-by [InboxLayout]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }));
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export function useToast() {
  const { addToast } = useToastStore();
  
  return {
    success: (message: string, duration?: number) => 
      addToast({ message, type: 'success', duration }),
    
    error: (message: string, duration?: number) => 
      addToast({ message, type: 'error', duration }),
    
    info: (message: string, duration?: number) => 
      addToast({ message, type: 'info', duration }),
    
    warning: (message: string, duration?: number) => 
      addToast({ message, type: 'warning', duration })
  };
}