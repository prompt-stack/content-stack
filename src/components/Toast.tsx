/**
 * @file components/Toast.tsx
 * @purpose Toast notification component for success/error messages
 * @layer primitives
 * @deps []
 * @used-by [useToast, InboxLayout]
 * @cssFile /styles/components/toast.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle
};

const colors = {
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
  warning: 'var(--color-warning)'
};

export function Toast({ id, message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[type];
  
  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);
    
    // Auto-close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);
  
  return (
    <div 
      className={`toast toast--${type} ${isVisible ? 'toast--visible' : ''}`}
      role="alert"
    >
      <Icon 
        size={20} 
        className="toast__icon" 
        style={{ color: colors[type] }}
      />
      <span className="toast__message">{message}</span>
      <button
        className="toast__close"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}