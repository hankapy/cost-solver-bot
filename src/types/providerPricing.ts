// Palveluntarjoajan (Akvamariini) kustannuslaskelmat

export interface ProviderCostCalculation {
  monthlyQueries: number;
  
  // Ihmisasiakaspalvelijan kulut
  humanServiceQueries: number;
  humanServiceHours: number;
  humanServiceHourlyRate: number;
  humanServiceCost: number;
  
  // Botin ylläpitokulut
  botMaintenanceHours: number;
  botMaintenanceHourlyRate: number;
  botMaintenanceCost: number;
  
  // Tekniset kulut
  technicalCosts: number;
  
  // Yhteensä
  totalProviderCost: number;
}

export interface ProviderHybridCalculation {
  month: number;
  botPercentage: number;
  
  // Bottikyselyt
  botQueries: number;
  botMaintenanceCost: number;
  
  // Ihmiskyselyt
  humanQueries: number;
  humanServiceHours: number;
  humanServiceCost: number;
  
  // Tekniset kulut
  technicalCosts: number;
  
  // Yhteensä
  totalMonthlyCost: number;
}

export interface CustomerVsProviderComparison {
  monthlyQueries: number;
  
  // Asiakkaan maksu meille
  customerPayment: number;
  
  // Meidän kustannukset
  providerCost: number;
  
  // Kate
  margin: number;
  marginPercentage: number;
}
