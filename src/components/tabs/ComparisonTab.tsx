import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePricing } from "@/contexts/PricingContext";
import { 
  calculateProviderHumanCost,
  calculateProviderBotCost,
  calculateProviderHybridMonth
} from "@/lib/providerCalculations";
import { calculateHumanCost, calculateBotCost, calculateHybridMonth } from "@/lib/pricingCalculations";

type ModelType = 'human' | 'bot' | 'hybrid';

export default function ComparisonTab() {
  const { settings } = usePricing();
  const [selectedModel, setSelectedModel] = useState<ModelType>('human');
  const [monthlyQueries, setMonthlyQueries] = useState(settings.monthlyQueries);
  const [selectedMonth, setSelectedMonth] = useState(6); // Kuukausi hybridimallille
  
  // Käytetään valittua kyselymäärää
  const customSettings = { ...settings, monthlyQueries };
  
  // Lasketaan palveluntarjoajan kustannukset eri malleille
  const providerHumanCost = calculateProviderHumanCost(customSettings);
  const providerBotCost = calculateProviderBotCost(customSettings);
  
  const customerHumanCost = calculateHumanCost(customSettings);
  const customerBotCost = calculateBotCost(customSettings, false);
  const customerHybridCost = calculateHybridMonth(selectedMonth, customSettings);
  
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return '0.00 €';
    return `${value.toFixed(2)} €`;
  };
  const formatPercent = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return '0.0%';
    return `${value.toFixed(1)}%`;
  };

  // Valitse oikea asiakkaan kustannus ja palveluntarjoajan kustannus mallin mukaan
  let selectedCustomerCost = 0;
  let selectedProviderCost = 0;
  
  if (selectedModel === 'human') {
    selectedCustomerCost = customerHumanCost.totalCost;
    selectedProviderCost = providerHumanCost.totalProviderCost;
  } else if (selectedModel === 'bot') {
    selectedCustomerCost = customerBotCost.totalCost;
    selectedProviderCost = providerBotCost.totalProviderCost;
  } else {
    // Hybridi - lasketaan palveluntarjoajan kustannukset
    const providerHybrid = calculateProviderHybridMonth(selectedMonth, customSettings);
    selectedCustomerCost = customerHybridCost.discountedCost;
    selectedProviderCost = providerHybrid.totalMonthlyCost;
  }
  
  const margin = selectedCustomerCost - selectedProviderCost;
  const marginPercentage = selectedCustomerCost > 0 ? (margin / selectedCustomerCost) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Asiakas vs. Palveluntarjoaja</h2>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Vertailuasetukset</CardTitle>
          <CardDescription>Valitse malli ja kyselymäärä</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyQueries">Kyselymäärä / kk</Label>
            <Input
              id="monthlyQueries"
              type="number"
              value={monthlyQueries}
              onChange={(e) => setMonthlyQueries(Number(e.target.value))}
              min="0"
            />
          </div>

          <div className="space-y-3">
            <Label>Valitse malli</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedModel('human')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedModel === 'human' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold">Ihmisvetoinen</div>
                <div className="text-sm text-muted-foreground">Kaikki hoidetaan ihmistyöllä</div>
              </button>
              
              <button
                onClick={() => setSelectedModel('bot')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedModel === 'bot' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold">Bottimalli</div>
                <div className="text-sm text-muted-foreground">Kaikki hoidetaan botilla</div>
              </button>
              
              <button
                onClick={() => setSelectedModel('hybrid')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedModel === 'hybrid' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold">Hybridi</div>
                <div className="text-sm text-muted-foreground">Botti + ihminen</div>
              </button>
            </div>
          </div>

          {selectedModel === 'hybrid' && (
            <div className="space-y-2">
              <Label htmlFor="selectedMonth">Kuukausi (hybridi)</Label>
              <Input
                id="selectedMonth"
                type="number"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                min="1"
                max="12"
              />
              <p className="text-xs text-muted-foreground">
                Botin osuus kuukaudella {selectedMonth}: {customerHybridCost.botPercentage}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card border-primary">
        <CardHeader>
          <CardTitle>Kate-analyysi ({selectedModel === 'human' ? 'Ihmisvetoinen' : selectedModel === 'bot' ? 'Bottimalli' : 'Hybridi'})</CardTitle>
          <CardDescription>
            Mitä asiakas maksaa vs. mitä meille jää käteen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Asiakkaan maksu meille</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(selectedCustomerCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                Tämä on mitä asiakas maksaa palvelusta
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Meidän kustannukset</p>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(selectedProviderCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                Palkat + muut kulut
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Kate</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(margin)}
              </p>
              <p className="text-xs text-muted-foreground">
                Katteemme: {formatPercent(marginPercentage)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-3">Erittelyt ({monthlyQueries} kyselyä/kk)</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">Asiakkaan kustannuserittely:</p>
                {selectedModel === 'human' && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tuntiveloitus:</span>
                      <span>{formatCurrency(customerHumanCost.hourlyLabor)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Peruskuukausihinta:</span>
                      <span>{formatCurrency(customerHumanCost.basePrice)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 font-medium">
                      <span>Yhteensä:</span>
                      <span>{formatCurrency(customerHumanCost.totalCost)}</span>
                    </div>
                  </div>
                )}
                {selectedModel === 'bot' && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Portaistettu hinta:</span>
                      <span>{formatCurrency(customerBotCost.tieredPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Järjestelmäkulut:</span>
                      <span>{formatCurrency(customerBotCost.systemCosts)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 font-medium">
                      <span>Yhteensä:</span>
                      <span>{formatCurrency(customerBotCost.totalCost)}</span>
                    </div>
                  </div>
                )}
                {selectedModel === 'hybrid' && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Botti ({customerHybridCost.botPercentage}%):</span>
                      <span>{formatCurrency(customerHybridCost.botCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ihminen ({100 - customerHybridCost.botPercentage}%):</span>
                      <span>{formatCurrency(customerHybridCost.humanTotalCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alennus ({settings.centralizationDiscount}%):</span>
                      <span>-{formatCurrency(customerHybridCost.combinedCost - customerHybridCost.discountedCost)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 font-medium">
                      <span>Yhteensä:</span>
                      <span>{formatCurrency(customerHybridCost.discountedCost)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">Meidän kustannuserittely:</p>
                <div className="space-y-1 text-sm">
                  {selectedModel === 'human' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Palkkakustannukset:</span>
                        <span>{formatCurrency(selectedProviderCost - settings.providerBaseCosts - (settings.humanTiers.find(t => monthlyQueries <= t.queryLimit)?.basePrice || 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Porrastettu hinnoittelu:</span>
                        <span>{formatCurrency(settings.providerHumanTiers.find(t => monthlyQueries <= t.queryLimit)?.basePrice || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peruskulut:</span>
                        <span>{formatCurrency(settings.providerBaseCosts)}</span>
                      </div>
                    </>
                  )}
                  {selectedModel === 'bot' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ylläpitokulut (tunnit):</span>
                        <span>{formatCurrency(settings.providerBotMaintenanceHoursPerMonth * settings.providerBotMaintenanceHourlyRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Järjestelmäkustannus (Azure):</span>
                        <span>{formatCurrency(settings.providerBotTiers.find(t => monthlyQueries <= t.queryLimit)?.systemCosts || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peruskulut:</span>
                        <span>{formatCurrency(settings.providerBaseCosts)}</span>
                      </div>
                    </>
                  )}
                  {selectedModel === 'hybrid' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Botin ylläpito:</span>
                        <span>{formatCurrency(settings.providerBotMaintenanceHoursPerMonth * settings.providerBotMaintenanceHourlyRate + (settings.providerBotTiers.find(t => customerHybridCost.botQueries <= t.queryLimit)?.systemCosts || 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ihmisasiakaspalvelu:</span>
                        <span>{formatCurrency(customerHybridCost.humanHours * settings.providerHumanHourlyRate + (settings.providerHumanTiers.find(t => customerHybridCost.humanQueries <= t.queryLimit)?.basePrice || 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peruskulut:</span>
                        <span>{formatCurrency(settings.providerBaseCosts)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-t pt-1 font-medium">
                    <span>Yhteensä:</span>
                    <span>{formatCurrency(selectedProviderCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Kaikki mallit - Asiakkaan näkökulma</CardTitle>
            <CardDescription>Mitä asiakas maksaa eri malleissa ({monthlyQueries} kyselyä/kk)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`flex justify-between items-center p-3 rounded ${selectedModel === 'human' ? 'bg-primary/10 border border-primary' : 'bg-muted'}`}>
              <span className="font-medium">Ihmisvetoinen:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(customerHumanCost.totalCost)}
              </span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded ${selectedModel === 'bot' ? 'bg-primary/10 border border-primary' : 'bg-muted'}`}>
              <span className="font-medium">Bottivetonen:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(customerBotCost.totalCost)}
              </span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded ${selectedModel === 'hybrid' ? 'bg-primary/10 border border-primary' : 'bg-muted'}`}>
              <span className="font-medium">Hybridi (kk {selectedMonth}):</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(customerHybridCost.discountedCost)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Kaikki mallit - Meidän näkökulma</CardTitle>
            <CardDescription>Meidän kustannukset eri malleissa ({monthlyQueries} kyselyä/kk)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`flex justify-between items-center p-3 rounded ${selectedModel === 'human' ? 'bg-destructive/10 border border-destructive' : 'bg-muted'}`}>
              <span className="font-medium">Ihmisvetoinen:</span>
              <span className="text-lg font-bold text-destructive">
                {formatCurrency(providerHumanCost.totalProviderCost)}
              </span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded ${selectedModel === 'bot' ? 'bg-destructive/10 border border-destructive' : 'bg-muted'}`}>
              <span className="font-medium">Bottivetonen:</span>
              <span className="text-lg font-bold text-destructive">
                {formatCurrency(settings.providerBotMaintenanceHoursPerMonth * settings.providerBotMaintenanceHourlyRate + (settings.providerBotTiers.find(t => monthlyQueries <= t.queryLimit)?.systemCosts || 0) + settings.providerBaseCosts)}
              </span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded ${selectedModel === 'hybrid' ? 'bg-destructive/10 border border-destructive' : 'bg-muted'}`}>
              <span className="font-medium">Hybridi (kk {selectedMonth}):</span>
              <span className="text-lg font-bold text-destructive">
                {formatCurrency(
                  settings.providerBotMaintenanceHoursPerMonth * settings.providerBotMaintenanceHourlyRate + 
                  (settings.providerBotTiers.find(t => customerHybridCost.botQueries <= t.queryLimit)?.systemCosts || 0) + 
                  settings.providerBaseCosts +
                  (customerHybridCost.humanHours * settings.providerHumanHourlyRate) +
                  (settings.providerHumanTiers.find(t => customerHybridCost.humanQueries <= t.queryLimit)?.basePrice || 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
