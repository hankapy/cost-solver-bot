import type { 
  PricingSettings, 
  HumanCostCalculation, 
  BotCostCalculation,
  HybridMonthCalculation,
  SavingsCalculation,
  ScenarioComparison
} from "@/types/pricing";

const HOURLY_RATE = 20; // €/h
const BASE_MONTHLY_PRICE = 250; // €/month

export function calculateHumanCost(settings: PricingSettings): HumanCostCalculation {
  const totalMinutes = settings.monthlyQueries * settings.minutesPerQuery;
  const totalHours = totalMinutes / 60;
  const hourlyLabor = totalHours * HOURLY_RATE;
  const totalCost = hourlyLabor + BASE_MONTHLY_PRICE;

  return {
    monthlyQueries: settings.monthlyQueries,
    minutesPerQuery: settings.minutesPerQuery,
    totalMinutes,
    totalHours,
    hourlyRate: HOURLY_RATE,
    hourlyLabor,
    basePrice: BASE_MONTHLY_PRICE,
    totalCost
  };
}

export function getBotTieredPrice(queries: number, settings: PricingSettings): number {
  // Find the appropriate tier
  const sortedTiers = [...settings.botTiers].sort((a, b) => a.queryLimit - b.queryLimit);
  
  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (queries >= sortedTiers[i].queryLimit) {
      return sortedTiers[i].price;
    }
  }
  
  // If no tier matches, return the first tier price
  return sortedTiers[0]?.price || 0;
}

export function calculateBotCost(settings: PricingSettings): BotCostCalculation {
  const tieredPrice = getBotTieredPrice(settings.monthlyQueries, settings);
  const totalCost = tieredPrice + settings.botStartupFee + settings.botMonthlyFee + settings.botSystemCosts;

  return {
    monthlyQueries: settings.monthlyQueries,
    tieredPrice,
    startupFee: settings.botStartupFee,
    monthlyFee: settings.botMonthlyFee,
    systemCosts: settings.botSystemCosts,
    totalCost
  };
}

export function calculateHybridMonth(
  month: number,
  settings: PricingSettings
): HybridMonthCalculation {
  const botGrowth = settings.botGrowth.find(g => g.month === month);
  const botPercentage = botGrowth?.percentage || 0;
  
  const botQueries = Math.round((settings.monthlyQueries * botPercentage) / 100);
  const humanQueries = settings.monthlyQueries - botQueries;
  
  const botCost = getBotTieredPrice(botQueries, settings);
  
  const humanMinutes = humanQueries * settings.minutesPerQuery;
  const humanHours = humanMinutes / 60;
  const humanLaborCost = humanHours * HOURLY_RATE;
  const humanTotalCost = humanLaborCost + BASE_MONTHLY_PRICE;
  
  const combinedCost = botCost + humanTotalCost + settings.botMonthlyFee + settings.botSystemCosts;
  const discountedCost = combinedCost * (1 - settings.centralizationDiscount / 100);

  return {
    month,
    botPercentage,
    botQueries,
    botCost,
    humanQueries,
    humanHours,
    hourlyRate: HOURLY_RATE,
    humanLaborCost,
    humanBaseCost: BASE_MONTHLY_PRICE,
    humanTotalCost,
    combinedCost,
    discountedCost
  };
}

export function calculateSavings(settings: PricingSettings): SavingsCalculation {
  const humanCost = calculateHumanCost(settings).totalCost;
  const botCost = calculateBotCost(settings).totalCost;
  const savings = humanCost - botCost;
  const savingsPercentage = (savings / humanCost) * 100;

  return {
    humanCost,
    botCost,
    savings,
    savingsPercentage
  };
}

export function calculateScenario(
  monthlyQueries: number,
  botPercentage: number,
  settings: PricingSettings
): ScenarioComparison {
  const scenarioSettings = { ...settings, monthlyQueries };
  
  const humanCost = calculateHumanCost(scenarioSettings).totalCost;
  
  const botQueries = Math.round((monthlyQueries * botPercentage) / 100);
  const botCost = getBotTieredPrice(botQueries, scenarioSettings) + 
                  settings.botMonthlyFee + 
                  settings.botSystemCosts;
  
  const humanQueries = monthlyQueries - botQueries;
  const humanMinutes = humanQueries * settings.minutesPerQuery;
  const humanHours = humanMinutes / 60;
  const humanLaborCost = humanHours * HOURLY_RATE;
  const humanPartCost = humanLaborCost + BASE_MONTHLY_PRICE;
  
  const hybridCost = (botCost + humanPartCost) * (1 - settings.centralizationDiscount / 100);
  
  const savings = humanCost - hybridCost;
  const savingsPercentage = (savings / humanCost) * 100;

  return {
    monthlyQueries,
    botPercentage,
    humanCost,
    botCost,
    hybridCost,
    savings,
    savingsPercentage
  };
}
