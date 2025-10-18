/**
 * @file components/FileInput.tsx
 * @purpose Component for FileInput
 * @layer primitive
 * @deps none
 * @used-by [ContentInboxInputPanel]
 * @css /styles/components/fileinput.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file FileInput.test.tsx
 * @test-status missing
 */
import React, { useRef } from 'react';
import { clsx } from 'clsx';

interface FileInputProps {
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileList | null) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ accept, multiple = false, onChange, className, children, disabled = false }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleClick = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.click();
      }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.files);
    };
    
    return (
      <div 
        className={clsx('fileinput', disabled && 'fileinput--disabled', className)}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={ref || inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="fileinput__native"
          disabled={disabled}
          aria-hidden="true"
        />
        {children || <span className="fileinput__label">Choose file</span>}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';
