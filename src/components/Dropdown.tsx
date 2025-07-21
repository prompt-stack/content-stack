/**
 * @layer composed
 * @description Custom dropdown/select component with enhanced styling
 * @dependencies Button, Box primitives
 * @cssFile /styles/components/forms.css
 * @className .dropdown
 * 
 * This is a COMPOSED component that creates a custom dropdown to replace the native
 * select element with better styling control and features.
 */

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface DropdownOption<T = string> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface DropdownProps<T = string> {
  options: DropdownOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  renderOption?: (option: DropdownOption<T>) => ReactNode;
}

export function Dropdown<T = string>({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  disabled,
  className,
  renderOption
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (option: DropdownOption<T>) => {
    if (!option.disabled) {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={clsx(
        'dropdown',
        isOpen && 'dropdown--open',
        disabled && 'dropdown--disabled',
        className
      )}
    >
      <button
        className="dropdown-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="dropdown-label">
          {selectedOption ? (
            <>
              {selectedOption.icon && <i className={`fas fa-${selectedOption.icon}`} />}
              {selectedOption.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} />
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="listbox">
          {options.map((option) => (
            <div
              key={String(option.value)}
              className={clsx(
                'dropdown-option',
                option.value === value && 'dropdown-option--selected',
                option.disabled && 'dropdown-option--disabled'
              )}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
            >
              {renderOption ? renderOption(option) : (
                <>
                  {option.icon && <i className={`fas fa-${option.icon}`} />}
                  {option.label}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}