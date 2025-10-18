/**
 * @file hooks/useUserSettings.ts
 * @purpose Hook for managing user settings including logo/avatar
 * @layer hooks
 * @deps none
 * @used-by [layouts, components]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState, useEffect } from 'react';

interface UserSettings {
  logoUrl?: string;
  companyName?: string;
  primaryColor?: string;
  // Add more settings as needed
}

const SETTINGS_KEY = 'content-stack-user-settings';

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Load from localStorage on init
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateLogo = (logoFile: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setSettings(prev => ({ ...prev, logoUrl }));
        resolve(logoUrl);
      };
      reader.onerror = () => reject(new Error('Failed to read logo file'));
      reader.readAsDataURL(logoFile);
    });
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearLogo = () => {
    setSettings(prev => {
      const { logoUrl, ...rest } = prev;
      return rest;
    });
  };

  return {
    settings,
    updateLogo,
    updateSettings,
    clearLogo,
    hasCustomLogo: !!settings.logoUrl
  };
}