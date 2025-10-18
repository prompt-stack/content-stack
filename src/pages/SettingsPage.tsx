/**
 * @file pages/SettingsPage.tsx
 * @purpose Settings/Profile page for managing user preferences
 * @layer pages
 * @deps [BaseLayout, useUserSettings, LogoUploader]
 * @used-by [App]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role page
 */

import { BaseLayout } from '../layout/BaseLayout';
import { Box } from '../components/Box';
import { Card } from '../components/Card';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { useUserSettings } from '../hooks/useUserSettings';
import { useToast } from '../hooks/useToast';
import { useState, useRef } from 'react';
import { Upload, Trash2, Save } from 'lucide-react';

export function SettingsPage() {
  const { settings, updateSettings, updateLogo, clearLogo, hasCustomLogo } = useUserSettings();
  const [companyName, setCompanyName] = useState(settings.companyName || '');
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#1DA1F2');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleSave = () => {
    updateSettings({
      companyName,
      primaryColor
    });
    toast.success('Settings saved successfully');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

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

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearLogo = () => {
    clearLogo();
    toast.success('Logo removed');
  };

  return (
    <BaseLayout>
      <div style={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Header */}
        <Box marginY="2">
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Settings</h1>
          <Text size="sm" color="muted">Manage your profile and preferences</Text>
        </Box>

        {/* Scrollable content area */}
        <div style={{ 
          flex: '1 1 auto', 
          overflow: 'auto',
          marginTop: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Profile Section */}
            <Card>
              <Box padding="4">
                <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Profile</h2>
                
                {/* Logo Upload */}
                <Box display="flex" align="center" gap="md" marginY="3">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    border: '2px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-background-secondary)'
                  }}>
                    {hasCustomLogo && settings.logoUrl ? (
                      <img 
                        src={settings.logoUrl} 
                        alt="Company logo"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" style={{ width: '30px', height: '30px', fill: 'var(--color-text-secondary)' }}>
                        <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"/>
                      </svg>
                    )}
                  </div>
                  <Box>
                    <Box display="flex" gap="sm">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={14} style={{ marginRight: '6px' }} />
                        Upload
                      </Button>
                      {hasCustomLogo && (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={handleClearLogo}
                        >
                          <Trash2 size={14} style={{ marginRight: '6px' }} />
                          Remove
                        </Button>
                      )}
                    </Box>
                    <Text size="xs" color="muted" style={{ marginTop: '4px' }}>
                      Max 2MB, PNG/JPG
                    </Text>
                  </Box>
                </Box>

                {/* Company Name */}
                <Box marginY="3">
                  <Label htmlFor="companyName" style={{ fontSize: '0.875rem' }}>Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    style={{ marginTop: '6px' }}
                  />
                </Box>
              </Box>
            </Card>

            {/* Appearance Section */}
            <Card>
              <Box padding="4">
                <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Appearance</h2>
                
                <Box display="flex" align="center" gap="md">
                  <input
                    type="color"
                    id="primaryColor"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{
                      width: '50px',
                      height: '36px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#1DA1F2"
                    style={{ width: '100px' }}
                  />
                  <Text size="sm" color="muted">
                    Primary color (coming soon)
                  </Text>
                </Box>
              </Box>
            </Card>

            {/* Storage Section */}
            <Card>
              <Box padding="4">
                <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Storage</h2>
                
                <Box display="flex" justify="between" align="center">
                  <Text size="sm">Local Storage</Text>
                  <Text size="sm" weight="medium">Unlimited</Text>
                </Box>
                <Text size="xs" color="muted" style={{ marginTop: '4px' }}>
                  Content stored locally on your device
                </Text>
              </Box>
            </Card>
          </div>
        </div>

        {/* Fixed footer with save buttons */}
        <Box display="flex" justify="end" gap="md" style={{ 
          paddingTop: '16px',
          borderTop: '1px solid var(--color-border)'
        }}>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Save size={14} style={{ marginRight: '6px' }} />
            Save Changes
          </Button>
        </Box>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          style={{ display: 'none' }}
        />
      </div>
    </BaseLayout>
  );
}