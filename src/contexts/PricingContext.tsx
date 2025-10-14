import React, { createContext, useContext, useState, ReactNode } from "react";
import type { PricingSettings } from "@/types/pricing";

const DEFAULT_SETTINGS: PricingSettings = {
  monthlyQueries: 100,
  minutesPerQuery: 20,
  centralizationDiscount: 10,
  humanHourlyRate: 20,
  humanTiers: [
    { queryLimit: 25, basePrice: 200 },
    { queryLimit: 50, basePrice: 225 },
    { queryLimit: 100, basePrice: 250 },
    { queryLimit: 150, basePrice: 275 },
    { queryLimit: 300, basePrice: 300 },
  ],
  humanBaseAmount: 250,
  useHumanFlatRate: false,
  useHumanFlatBasePrice: false,
  providerHumanHourlyRate: 18,
  providerHumanTiers: [
    { queryLimit: 25, basePrice: 150 },
    { queryLimit: 50, basePrice: 175 },
    { queryLimit: 100, basePrice: 200 },
    { queryLimit: 150, basePrice: 225 },
    { queryLimit: 300, basePrice: 250 },
  ],
  providerBotMaintenanceHourlyRate: 25,
  providerBotMaintenanceHoursPerMonth: 20,
  providerBotMaintenanceTiers: [
    { queryLimit: 25, maintenanceHours: 4 },
    { queryLimit: 50, maintenanceHours: 8 },
    { queryLimit: 100, maintenanceHours: 10 },
    { queryLimit: 150, maintenanceHours: 12 },
    { queryLimit: 300, maintenanceHours: 16 },
  ],
  providerBotTiers: [
    { queryLimit: 25, price: 0, systemCosts: 125 },
    { queryLimit: 50, price: 0, systemCosts: 150 },
    { queryLimit: 100, price: 0, systemCosts: 150 },
    { queryLimit: 150, price: 0, systemCosts: 200 },
    { queryLimit: 300, price: 0, systemCosts: 200 },
  ],
  providerTechnicalCosts: 100,
  providerBaseCosts: 150,
  skipProviderBaseCosts: false,
  skipProviderHumanTiers: false,
  providerHumanWorkCost: 0,
  providerBotMaintenanceCost: 0,
  botStartupFee: 3000,
  botMonthlyFee: 300,
  botSystemCosts: 150,
  useFlatRate: false,
  flatMonthlyRate: 500,
  botTiers: [
    { queryLimit: 25, price: 200, systemCosts: 125 },
    { queryLimit: 50, price: 200, systemCosts: 150 },
    { queryLimit: 100, price: 250, systemCosts: 150 },
    { queryLimit: 150, price: 350, systemCosts: 200 },
    { queryLimit: 300, price: 500, systemCosts: 200 },
  ],
  botGrowth: [
    { month: 1, percentage: 5 },
    { month: 2, percentage: 10 },
    { month: 3, percentage: 10 },
    { month: 4, percentage: 15 },
    { month: 5, percentage: 15 },
    { month: 6, percentage: 20 },
    { month: 7, percentage: 25 },
    { month: 8, percentage: 25 },
    { month: 9, percentage: 30 },
    { month: 10, percentage: 40 },
    { month: 11, percentage: 45 },
    { month: 12, percentage: 50 },
  ],
  botYearlyGrowth: [
    { year: 0, percentage: 5 },
    { year: 1, percentage: 50 },
    { year: 2, percentage: 75 },
    { year: 3, percentage: 90 },
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
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <PricingContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}
