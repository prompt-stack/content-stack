/**
 * @file components/ToastContainer.tsx
 * @purpose Container for rendering toast notifications
 * @layer composed
 * @deps [Toast, useToastStore]
 * @used-by [BaseLayout]
 * @cssFile /styles/components/toast.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { createPortal } from 'react-dom';
import { Toast } from './Toast';
import { useToastStore } from '../hooks/useToast';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  
  if (toasts.length === 0) return null;
  
  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>,
    document.body
  );
}