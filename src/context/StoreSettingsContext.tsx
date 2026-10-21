import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { StoreSettings } from '../types/index.ts';

interface StoreSettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettingsMap: Record<string, any>, authHeaders: Record<string, string>) => Promise<boolean>;
}

const defaultSettings: StoreSettings = {
  storeName: 'Buzz by BeePri',
  tagline: 'Small Things, Made with Love',
  whatsappNumber: '+91 98765 43210',
  instagramHandle: '@buzzbybeepri',
  freeShippingThreshold: 999,
  standardShippingFee: 79,
  codEnabled: true,
  announcementBanner: '🌸 Free Pan-India shipping on all handmade orders above ₹999! Code: BUZZLOVE',
};

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          storeName: data.storeName || defaultSettings.storeName,
          tagline: data.tagline || defaultSettings.tagline,
          whatsappNumber: data.whatsappNumber || defaultSettings.whatsappNumber,
          instagramHandle: data.instagramHandle || defaultSettings.instagramHandle,
          freeShippingThreshold: Number(data.freeShippingThreshold) || defaultSettings.freeShippingThreshold,
          standardShippingFee: Number(data.standardShippingFee) || defaultSettings.standardShippingFee,
          codEnabled: data.codEnabled !== false,
          announcementBanner: data.announcementBanner || defaultSettings.announcementBanner,
        });
      }
    } catch (err) {
      console.error('Failed to load store settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = async (
    newSettingsMap: Record<string, any>,
    authHeaders: Record<string, string>
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ settings: newSettingsMap }),
      });

      if (res.ok) {
        await refreshSettings();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save settings:', err);
      return false;
    }
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings,
        updateSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
};
