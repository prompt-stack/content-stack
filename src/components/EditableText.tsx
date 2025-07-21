/**
 * @file components/EditableText.tsx
 * @purpose Component for EditableText
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [ContentInboxQueuePanel]
 * @css /styles/components/editabletext.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableText({ value, onSave, className, placeholder = 'Click to edit', multiline = false }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue !== value) {
      onSave(trimmedValue || placeholder);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as React.Ref<HTMLInputElement | HTMLTextAreaElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={clsx('editabletext__input', className)}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={clsx('editabletext', className)}
      title="Click to edit"
    >
      {value || placeholder}
    </span>
  );
}
