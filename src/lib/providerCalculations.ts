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
  const totalMinutes = settings.monthlyQueries * settings.minutesPerQuery;
  const humanServiceHours = totalMinutes / 60;
  const humanServiceCost = humanServiceHours * settings.providerHumanHourlyRate;
  
  return {
    monthlyQueries: settings.monthlyQueries,
    humanServiceQueries: settings.monthlyQueries,
    humanServiceHours,
    humanServiceHourlyRate: settings.providerHumanHourlyRate,
    humanServiceCost,
    botMaintenanceHours: 0,
    botMaintenanceHourlyRate: 0,
    botMaintenanceCost: 0,
    technicalCosts: settings.providerTechnicalCosts,
    totalProviderCost: humanServiceCost + settings.providerTechnicalCosts
  };
}

/**
 * Laskee palveluntarjoajan kustannukset täysin bottivetoisessa mallissa
 */
export function calculateProviderBotCost(settings: PricingSettings): ProviderCostCalculation {
  const botMaintenanceCost = settings.providerBotMaintenanceHoursPerMonth * settings.providerBotMaintenanceHourlyRate;
  
  return {
    monthlyQueries: settings.monthlyQueries,
    humanServiceQueries: 0,
    humanServiceHours: 0,
    humanServiceHourlyRate: 0,
    humanServiceCost: 0,
    botMaintenanceHours: settings.providerBotMaintenanceHoursPerMonth,
    botMaintenanceHourlyRate: settings.providerBotMaintenanceHourlyRate,
    botMaintenanceCost,
    technicalCosts: settings.providerTechnicalCosts,
    totalProviderCost: botMaintenanceCost + settings.providerTechnicalCosts
  };
}

/**
 * Laskee palveluntarjoajan kustannukset hybridimallissa kuukausittain
 */
export function calculateProviderHybridMonth(
  month: number,
  settings: PricingSettings
): ProviderHybridCalculation {
  const botGrowth = settings.botGrowth.find(g => g.month === month);
  const botPercentage = botGrowth?.percentage || 0;
  
  const botQueries = Math.round((settings.monthlyQueries * botPercentage) / 100);
  const humanQueries = settings.monthlyQueries - botQueries;
  
  // Botin ylläpitokulut
  const botMaintenanceCost = settings.providerBotMaintenanceHoursPerMonth * settings.providerBotMaintenanceHourlyRate;
  
  // Ihmisasiakaspalvelun kulut
  const humanMinutes = humanQueries * settings.minutesPerQuery;
  const humanServiceHours = humanMinutes / 60;
  const humanServiceCost = humanServiceHours * settings.providerHumanHourlyRate;
  
  const totalMonthlyCost = botMaintenanceCost + humanServiceCost + settings.providerTechnicalCosts;

  return {
    month,
    botPercentage,
    botQueries,
    botMaintenanceCost,
    humanQueries,
    humanServiceHours,
    humanServiceCost,
    technicalCosts: settings.providerTechnicalCosts,
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
