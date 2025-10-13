import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { PricingSettings } from '@/types/pricing';

const DEFAULT_SETTINGS: PricingSettings = {
  monthlyQueries: 100,
  minutesPerQuery: 20,
  centralizationDiscount: 10,
  botStartupFee: 500,
  botMonthlyFee: 300,
  botSystemCosts: 200,
  botTiers: [
    { queryLimit: 100, price: 400 },
    { queryLimit: 150, price: 500 },
    { queryLimit: 200, price: 600 },
    { queryLimit: 300, price: 700 },
    { queryLimit: 500, price: 800 },
  ],
  botGrowth: [
    { month: 1, percentage: 10 },
    { month: 2, percentage: 12 },
    { month: 3, percentage: 15 },
    { month: 4, percentage: 18 },
    { month: 5, percentage: 22 },
    { month: 6, percentage: 25 },
    { month: 7, percentage: 28 },
    { month: 8, percentage: 30 },
    { month: 9, percentage: 33 },
    { month: 10, percentage: 36 },
    { month: 11, percentage: 38 },
    { month: 12, percentage: 40 },
  ],
};

interface PricingContextType {
  settings: PricingSettings;
  updateSettings: (newSettings: Partial<PricingSettings>) => void;
  resetSettings: () => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PricingSettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<PricingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <PricingContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}
