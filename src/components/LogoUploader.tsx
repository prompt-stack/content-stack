/**
 * @file components/LogoUploader.tsx
 * @purpose Logo component with upload functionality for sidebar
 * @layer components
 * @deps [useUserSettings]
 * @used-by [BaseLayout, InboxLayout]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useRef } from 'react';
import { useUserSettings } from '../hooks/useUserSettings';
import { useToast } from '../hooks/useToast';

interface LogoUploaderProps {
  size?: number;
  showUploadHint?: boolean;
  className?: string;
}

export function LogoUploader({ 
  size = 24, 
  showUploadHint = true,
  className = 'sidebar__logo'
}: LogoUploaderProps) {
  const { settings, updateLogo, hasCustomLogo } = useUserSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleClick = () => {
    if (showUploadHint) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    try {
      await updateLogo(file);
      toast.success('Logo updated successfully');
    } catch (error) {
      toast.error('Failed to update logo');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0,
    cursor: showUploadHint ? 'pointer' : 'default',
    position: 'relative' as const,
    borderRadius: hasCustomLogo ? '4px' : '0',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <>
      <div 
        className={className} 
        style={containerStyle}
        onClick={handleClick}
        title={showUploadHint ? 'Click to upload logo' : undefined}
      >
        {hasCustomLogo && settings.logoUrl ? (
          <img 
            src={settings.logoUrl} 
            alt={settings.companyName || 'Company logo'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <svg 
            viewBox="0 0 24 24" 
            style={{ 
              width: `${size}px`, 
              height: `${size}px`, 
              fill: 'var(--color-primary)' 
            }}
          >
            <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"/>
          </svg>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}