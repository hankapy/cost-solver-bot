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

export function getHumanTieredBasePrice(queries: number, settings: PricingSettings): number {
  // Find the appropriate tier
  const sortedTiers = [...settings.humanTiers].sort((a, b) => a.queryLimit - b.queryLimit);
  
  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (queries >= sortedTiers[i].queryLimit) {
      return sortedTiers[i].basePrice;
    }
  }
  
  // If no tier matches, return the first tier price
  return sortedTiers[0]?.basePrice || 0;
}

export function calculateHumanCost(settings: PricingSettings): HumanCostCalculation {
  const totalMinutes = settings.monthlyQueries * settings.minutesPerQuery;
  const totalHours = totalMinutes / 60;
  const hourlyLabor = totalHours * settings.humanHourlyRate;
  const basePrice = getHumanTieredBasePrice(settings.monthlyQueries, settings);
  const totalCost = hourlyLabor + basePrice;

  return {
    monthlyQueries: settings.monthlyQueries,
    minutesPerQuery: settings.minutesPerQuery,
    totalMinutes,
    totalHours,
    hourlyRate: settings.humanHourlyRate,
    hourlyLabor,
    basePrice,
    totalCost
  };
}

export function getBotTieredPrice(queries: number, settings: PricingSettings): { price: number; systemCosts: number } {
  // Jos kyselyjä ei ole, palauta nollakulut
  if (queries === 0) {
    return { price: 0, systemCosts: 0 };
  }
  
  // Järjestä tierit pienimmästä suurimpaan queryLimitin mukaan
  const sortedTiers = [...settings.botTiers].sort((a, b) => a.queryLimit - b.queryLimit);
  
  // Etsi PIENIN tier johon kyselymäärä mahtuu (queries <= queryLimit)
  for (let i = 0; i < sortedTiers.length; i++) {
    if (queries <= sortedTiers[i].queryLimit) {
      return { 
        price: sortedTiers[i].price,
        systemCosts: sortedTiers[i].systemCosts
      };
    }
  }
  
  // Jos kyselymäärä ylittää kaikki tierit, käytä korkeimman tierin hintaa
  const highestTier = sortedTiers[sortedTiers.length - 1];
  return {
    price: highestTier?.price || 0,
    systemCosts: highestTier?.systemCosts || 0
  };
}

export function calculateBotCost(settings: PricingSettings, includeStartupFee = false): BotCostCalculation {
  const tieredData = getBotTieredPrice(settings.monthlyQueries, settings);
  
  // Ensimmäinen kuukausi = vain aloitusmaksu
  // Toinen kuukausi alkaen = portaistettu hinta + järjestelmäkulut
  if (includeStartupFee) {
    return {
      monthlyQueries: settings.monthlyQueries,
      tieredPrice: 0,
      startupFee: settings.botStartupFee,
      monthlyFee: 0,
      systemCosts: 0,
      totalCost: settings.botStartupFee
    };
  }
  
  const monthlyCost = tieredData.price + tieredData.systemCosts;

  return {
    monthlyQueries: settings.monthlyQueries,
    tieredPrice: tieredData.price,
    startupFee: 0,
    monthlyFee: 0,
    systemCosts: tieredData.systemCosts,
    totalCost: monthlyCost
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
  
  // Ensimmäinen kuukausi: vain aloitusmaksu
  // Toisesta alkaen: portaistettu hinta + järjestelmäkulut
  let botCost = 0;
  if (month === 1) {
    botCost = settings.botStartupFee;
  } else {
    const botTieredData = getBotTieredPrice(botQueries, settings);
    botCost = botTieredData.price + botTieredData.systemCosts;
  }
  
  const humanMinutes = humanQueries * settings.minutesPerQuery;
  const humanHours = humanMinutes / 60;
  const humanLaborCost = humanHours * settings.humanHourlyRate;
  const humanBasePrice = getHumanTieredBasePrice(humanQueries, settings);
  const humanTotalCost = humanLaborCost + humanBasePrice;
  
  const combinedCost = botCost + humanTotalCost;
  const discountedCost = combinedCost * (1 - settings.centralizationDiscount / 100);

  return {
    month,
    botPercentage,
    botQueries,
    botCost,
    humanQueries,
    humanHours,
    hourlyRate: settings.humanHourlyRate,
    humanLaborCost,
    humanBaseCost: humanBasePrice,
    humanTotalCost,
    combinedCost,
    discountedCost
  };
}

export function calculateSavings(settings: PricingSettings): SavingsCalculation {
  const humanCost = calculateHumanCost(settings).totalCost;
  // Käytetään peruskuukausihintaa ilman aloitusmaksua vertailussa
  const botCost = calculateBotCost(settings, false).totalCost;
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
  const botTieredData = getBotTieredPrice(botQueries, scenarioSettings);
  const botMonthlyCost = botTieredData.price + botTieredData.systemCosts;
  
  const humanQueries = monthlyQueries - botQueries;
  const humanMinutes = humanQueries * settings.minutesPerQuery;
  const humanHours = humanMinutes / 60;
  const humanLaborCost = humanHours * settings.humanHourlyRate;
  const humanBasePrice = getHumanTieredBasePrice(humanQueries, settings);
  const humanPartCost = humanLaborCost + humanBasePrice;
  
  const hybridCost = (botMonthlyCost + humanPartCost) * (1 - settings.centralizationDiscount / 100);
  
  const savings = humanCost - hybridCost;
  const savingsPercentage = (savings / humanCost) * 100;

  return {
    monthlyQueries,
    botPercentage,
    humanCost,
    botCost: botMonthlyCost,
    hybridCost,
    savings,
    savingsPercentage
  };
}
