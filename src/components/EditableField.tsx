/**
 * @file components/EditableField.tsx
 * @purpose Component for EditableField
 * @layer composed
 * @deps Box, Text, Input, Button
 * @used-by none
 * @css /styles/components/editable-field.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file EditableField.test.tsx
 * @test-status missing
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'number';
  required?: boolean;
  disabled?: boolean;
  validator?: (value: string) => string | undefined; // Returns error message if invalid
  renderValue?: (value: string) => ReactNode; // Custom render for display mode
  multiline?: boolean;
  maxLength?: number;
  className?: string;
  editOnClick?: boolean;
  showEditButton?: boolean;
  onEditStart?: () => void;
  onEditEnd?: (saved: boolean) => void;
}

export function EditableField({
  value,
  onChange,
  label,
  placeholder = 'Click to edit',
  type = 'text',
  required = false,
  disabled = false,
  validator,
  renderValue,
  multiline = false,
  maxLength,
  className = '',
  editOnClick = true,
  showEditButton = true,
  onEditStart,
  onEditEnd
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const startEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setLocalValue(value);
    setError(undefined);
    onEditStart?.();
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setLocalValue(value);
    setError(undefined);
    onEditEnd?.(false);
  };

  const saveEdit = () => {
    // Validate
    if (required && !localValue.trim()) {
      setError('This field is required');
      return;
    }

    if (validator) {
      const validationError = validator(localValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Save
    onChange(localValue.trim());
    setIsEditing(false);
    setError(undefined);
    onEditEnd?.(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const fieldClasses = [
    'editable-field',
    isEditing && 'editable-field--editing',
    disabled && 'editable-field--disabled',
    error && 'editable-field--error',
    className
  ].filter(Boolean).join(' ');

  if (isEditing) {
    return (
      <Box className={fieldClasses}>
        {label && (
          <Text size="sm" weight="medium" className="editable-field__label">
            {label}
            {required && <span className="editable-field__required">*</span>}
          </Text>
        )}
        <Box className="editable-field__input-wrapper">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => saveEdit()}
              placeholder={placeholder}
              maxLength={maxLength}
              className="editable-field__textarea"
              disabled={disabled}
            />
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => saveEdit()}
              placeholder={placeholder}
              maxLength={maxLength}
              className="editable-field__input"
              disabled={disabled}
            />
          )}
          <Box className="editable-field__actions">
            <Button
              size="small"
              variant="primary"
              onClick={saveEdit}
              iconLeft={<i className="fas fa-check" />}
              aria-label="Save"
            />
            <Button
              size="small"
              variant="secondary"
              onClick={cancelEdit}
              iconLeft={<i className="fas fa-times" />}
              aria-label="Cancel"
            />
          </Box>
        </Box>
        {error && (
          <Text size="xs" className="editable-field__error">
            {error}
          </Text>
        )}
      </Box>
    );
  }

  return (
    <Box className={fieldClasses}>
      {label && (
        <Text size="sm" weight="medium" className="editable-field__label">
          {label}
          {required && <span className="editable-field__required">*</span>}
        </Text>
      )}
      <Box 
        className="editable-field__display"
        onClick={editOnClick ? startEdit : undefined}
      >
        <Box className="editable-field__value">
          {renderValue ? (
            renderValue(value)
          ) : (
            <Text className="editable-field__text">
              {value || <span className="editable-field__placeholder">{placeholder}</span>}
            </Text>
          )}
        </Box>
        {showEditButton && !disabled && (
          <Button
            size="small"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              startEdit();
            }}
            iconLeft={<i className="fas fa-edit" />}
            aria-label="Edit"
            className="editable-field__edit-button"
          />
        )}
      </Box>
    </Box>
  );
}
