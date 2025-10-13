export interface PricingSettings {
  monthlyQueries: number;
  minutesPerQuery: number;
  centralizationDiscount: number;
  
  // Human costs
  humanHourlyRate: number;
  humanTiers: HumanTier[];
  
  // Bot costs
  botStartupFee: number;
  botMonthlyFee: number;
  botSystemCosts: number;
  
  // Bot tiered pricing
  botTiers: BotTier[];
  
  // Bot percentage growth per month
  botGrowth: BotGrowthMonth[];
  
  // Bot percentage for yearly periods (years 0-3)
  botYearlyGrowth: BotGrowthYear[];
}

export interface BotGrowthYear {
  year: number;
  percentage: number;
}

export interface HumanTier {
  queryLimit: number;
  basePrice: number;
}

export interface BotTier {
  queryLimit: number;
  price: number;
}

export interface BotGrowthMonth {
  month: number;
  percentage: number;
}

export interface HumanCostCalculation {
  monthlyQueries: number;
  minutesPerQuery: number;
  totalMinutes: number;
  totalHours: number;
  hourlyRate: number;
  hourlyLabor: number;
  basePrice: number;
  totalCost: number;
}

export interface BotCostCalculation {
  monthlyQueries: number;
  tieredPrice: number;
  startupFee: number;
  monthlyFee: number;
  systemCosts: number;
  totalCost: number;
}

export interface HybridMonthCalculation {
  month: number;
  botPercentage: number;
  botQueries: number;
  botCost: number;
  humanQueries: number;
  humanHours: number;
  hourlyRate: number;
  humanLaborCost: number;
  humanBaseCost: number;
  humanTotalCost: number;
  combinedCost: number;
  discountedCost: number;
}

export interface SavingsCalculation {
  humanCost: number;
  botCost: number;
  savings: number;
  savingsPercentage: number;
}

export interface ScenarioComparison {
  monthlyQueries: number;
  botPercentage: number;
  humanCost: number;
  botCost: number;
  hybridCost: number;
  savings: number;
  savingsPercentage: number;
}
