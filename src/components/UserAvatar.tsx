/**
 * @file components/UserAvatar.tsx
 * @purpose User avatar component that displays custom logo or default icon
 * @layer components
 * @deps [useUserSettings]
 * @used-by [layouts, TwitterEditor]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useUserSettings } from '../hooks/useUserSettings';

interface UserAvatarProps {
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export function UserAvatar({ 
  size = 48, 
  backgroundColor = '#1DA1F2',
  iconColor = 'white',
  className = '',
  onClick
}: UserAvatarProps) {
  const { settings } = useUserSettings();
  
  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: settings.logoUrl ? 'transparent' : backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.42}px`,
    color: iconColor,
    flexShrink: 0,
    cursor: onClick ? 'pointer' : 'default',
    overflow: 'hidden',
    position: 'relative' as const
  };

  if (settings.logoUrl) {
    return (
      <div style={containerStyle} className={className} onClick={onClick}>
        <img 
          src={settings.logoUrl} 
          alt={settings.companyName || 'User avatar'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    );
  }

  // Default SVG icon
  return (
    <div style={containerStyle} className={className} onClick={onClick}>
      <svg viewBox="0 0 24 24" style={{ width: `${size * 0.5}px`, height: `${size * 0.5}px`, fill: iconColor }}>
        <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"/>
      </svg>
    </div>
  );
}