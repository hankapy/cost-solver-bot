import type { PricingSettings } from "@/types/pricing";
import type { 
  ProviderCostCalculation, 
  ProviderHybridCalculation,
  CustomerVsProviderComparison 
} from "@/types/providerPricing";
import { calculateHumanCost, calculateBotCost } from "./pricingCalculations";

/**
 * Laskee palveluntarjoajan (Akvamariini) kustannukset täysin ihmisvetoisessa mallissa
 */
export function calculateProviderHumanCost(settings: PricingSettings): ProviderCostCalculation {
  const totalMinutes = (settings.monthlyQueries || 0) * (settings.minutesPerQuery || 0);
  const humanServiceHours = totalMinutes / 60;
  const humanServiceCost = humanServiceHours * (settings.providerHumanHourlyRate || 0);
  
  // Porrastettu hinta tulee PALVELUNTARJOAJAN portaistuksesta (ei asiakkaan)
  const sortedTiers = [...settings.providerHumanTiers].sort((a, b) => a.queryLimit - b.queryLimit);
  const tieredPrice = sortedTiers.find(tier => settings.monthlyQueries <= tier.queryLimit)?.basePrice || 
                     sortedTiers[sortedTiers.length - 1]?.basePrice || 0;
  
  const baseCosts = settings.providerBaseCosts || 0;
  
  // Ihmisvetoiseen ei teknisiä kuluja
  const totalProviderCost = humanServiceCost + tieredPrice + baseCosts;
  
  return {
    monthlyQueries: settings.monthlyQueries || 0,
    humanServiceQueries: settings.monthlyQueries || 0,
    humanServiceHours,
    humanServiceHourlyRate: settings.providerHumanHourlyRate || 0,
    humanServiceCost,
    humanWorkCost: tieredPrice, // Porrastettu hinta tähän
    botMaintenanceHours: 0,
    botMaintenanceHourlyRate: 0,
    botMaintenanceCost: 0,
    botMaintenanceFixedCost: 0,
    baseCosts,
    technicalCosts: 0, // Ei teknisiä kuluja ihmisvetoiseen
    totalProviderCost
  };
}

/**
 * Laskee palveluntarjoajan kustannukset täysin bottivetoisessa mallissa
 */
export function calculateProviderBotCost(settings: PricingSettings): ProviderCostCalculation {
  const botMaintenanceCost = (settings.providerBotMaintenanceHoursPerMonth || 0) * (settings.providerBotMaintenanceHourlyRate || 0);
  
  // Järjestelmäkulut tulevat PALVELUNTARJOAJAN portaistuksesta (ei asiakkaan)
  const sortedTiers = [...settings.providerBotTiers].sort((a, b) => a.queryLimit - b.queryLimit);
  const systemCosts = sortedTiers.find(tier => settings.monthlyQueries <= tier.queryLimit)?.systemCosts || 
                     sortedTiers[sortedTiers.length - 1]?.systemCosts || 0;
  
  const baseCosts = settings.providerBaseCosts || 0;
  
  const totalProviderCost = botMaintenanceCost + systemCosts + baseCosts;
  
  return {
    monthlyQueries: settings.monthlyQueries || 0,
    humanServiceQueries: 0,
    humanServiceHours: 0,
    humanServiceHourlyRate: 0,
    humanServiceCost: 0,
    humanWorkCost: 0,
    botMaintenanceHours: settings.providerBotMaintenanceHoursPerMonth || 0,
    botMaintenanceHourlyRate: settings.providerBotMaintenanceHourlyRate || 0,
    botMaintenanceCost,
    botMaintenanceFixedCost: systemCosts, // Järjestelmäkulut tähän
    baseCosts,
    technicalCosts: 0,
    totalProviderCost
  };
}

/**
 * Laskee palveluntarjoajan kustannukset hybridimallissa kuukausittain
 */
export function calculateProviderHybridMonth(
  month: number,
  settings: PricingSettings
): ProviderHybridCalculation {
  const botGrowth = settings.botGrowth?.find(g => g.month === month);
  const botPercentage = botGrowth?.percentage || 0;
  
  const monthlyQueries = settings.monthlyQueries || 0;
  const botQueries = Math.round((monthlyQueries * botPercentage) / 100);
  const humanQueries = monthlyQueries - botQueries;
  
  // Botin ylläpitokulut
  const botMaintenanceCost = (settings.providerBotMaintenanceHoursPerMonth || 0) * (settings.providerBotMaintenanceHourlyRate || 0);
  
  // Ihmisasiakaspalvelun kulut
  const humanMinutes = humanQueries * (settings.minutesPerQuery || 0);
  const humanServiceHours = humanMinutes / 60;
  const humanServiceCost = humanServiceHours * (settings.providerHumanHourlyRate || 0);
  
  const technicalCosts = settings.providerTechnicalCosts || 0;
  const totalMonthlyCost = botMaintenanceCost + humanServiceCost + technicalCosts;

  return {
    month,
    botPercentage,
    botQueries,
    botMaintenanceCost,
    humanQueries,
    humanServiceHours,
    humanServiceCost,
    technicalCosts,
    totalMonthlyCost
  };
}

/**
 * Vertailee asiakkaan maksua ja palveluntarjoajan kustannuksia
 */
export function compareCustomerVsProvider(settings: PricingSettings): CustomerVsProviderComparison {
  // Asiakkaan maksu (mitä asiakas maksaa meille)
  const customerPayment = calculateHumanCost(settings).totalCost;
  
  // Meidän kustannukset
  const providerCost = calculateProviderHumanCost(settings).totalProviderCost;
  
  // Kate
  const margin = customerPayment - providerCost;
  const marginPercentage = (margin / customerPayment) * 100;

  return {
    monthlyQueries: settings.monthlyQueries,
    customerPayment,
    providerCost,
    margin,
    marginPercentage
  };
}
