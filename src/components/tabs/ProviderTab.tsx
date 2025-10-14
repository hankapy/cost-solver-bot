import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePricing } from "@/contexts/PricingContext";
import { 
  calculateProviderHumanCost, 
  calculateProviderBotCost,
  calculateProviderHybridMonth 
} from "@/lib/providerCalculations";

export default function ProviderTab() {
  const { settings, updateSettings } = usePricing();
  
  const humanCost = calculateProviderHumanCost(settings);
  const botCost = calculateProviderBotCost(settings);
  
  // Lasketaan porrastettu hinta ihmistyölle PALVELUNTARJOAJAN porrastuksesta
  const humanTieredPrice = settings.providerHumanTiers
    .sort((a, b) => a.queryLimit - b.queryLimit)
    .find(tier => settings.monthlyQueries <= tier.queryLimit)?.basePrice || 
    settings.providerHumanTiers[settings.providerHumanTiers.length - 1]?.basePrice || 0;
    
  // Lasketaan järjestelmäkulut botille PALVELUNTARJOAJAN porrastuksesta
  const botSystemCosts = settings.providerBotTiers
    .sort((a, b) => a.queryLimit - b.queryLimit)
    .find(tier => settings.monthlyQueries <= tier.queryLimit)?.systemCosts || 
    settings.providerBotTiers[settings.providerBotTiers.length - 1]?.systemCosts || 0;
  
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return '0.00 €';
    return `${value.toFixed(2)} €`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Palveluntarjoajan kustannukset (Akvamariini)</h2>
        <p className="text-muted-foreground">
          Meidän todelliset kustannukset palvelun tuottamisesta
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Perusasetukset</CardTitle>
          <CardDescription>Kustannukset jotka koskevat molempia malleja</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyQueries">Kyselymäärä / kuukausi</Label>
            <Input
              id="monthlyQueries"
              type="number"
              value={settings.monthlyQueries}
              onChange={(e) => updateSettings({ monthlyQueries: Number(e.target.value) })}
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Porrastetut hinnat päivittyvät automaattisesti tämän perusteella
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="providerBaseCosts">Peruskulut (€/kk)</Label>
            <Input
              id="providerBaseCosts"
              type="number"
              value={settings.providerBaseCosts}
              onChange={(e) => updateSettings({ providerBaseCosts: Number(e.target.value) })}
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Peruskulut molemmille malleille
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Täysin ihmisvetoinen malli</CardTitle>
            <CardDescription>Kustannukset kun kaikki hoidetaan ihmistyöllä</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="providerHumanHourlyRate">Palkkakustannus (€/h)</Label>
                <Input
                  id="providerHumanHourlyRate"
                  type="number"
                  value={settings.providerHumanHourlyRate}
                  onChange={(e) => updateSettings({ providerHumanHourlyRate: Number(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Porrastettu hinnoittelu (€/kk)</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  <span className="text-sm font-semibold">{humanTieredPrice.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Arvo tulee alta Palveluntarjoajan porrastuksesta
                </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-sm">Palveluntarjoajan porrastettu hinnoittelu (meidän kulut)</h4>
              <div className="space-y-3">
                {settings.providerHumanTiers.map((tier, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`provider-human-tier-limit-${index}`}>Kyselyraja</Label>
                      <Input
                        id={`provider-human-tier-limit-${index}`}
                        type="number"
                        value={tier.queryLimit}
                        onChange={(e) => {
                          const newTiers = [...settings.providerHumanTiers];
                          newTiers[index].queryLimit = Number(e.target.value);
                          updateSettings({ providerHumanTiers: newTiers });
                        }}
                        min="0"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`provider-human-tier-price-${index}`}>Hinta (€/kk)</Label>
                      <Input
                        id={`provider-human-tier-price-${index}`}
                        type="number"
                        value={tier.basePrice}
                        onChange={(e) => {
                          const newTiers = [...settings.providerHumanTiers];
                          newTiers[index].basePrice = Number(e.target.value);
                          updateSettings({ providerHumanTiers: newTiers });
                        }}
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

              <div className="space-y-2">
                <Label htmlFor="minutesPerQuery">Minuuttia per kysely</Label>
                <Input
                  id="minutesPerQuery"
                  type="number"
                  value={settings.minutesPerQuery}
                  onChange={(e) => updateSettings({ minutesPerQuery: Number(e.target.value) })}
                  min="0"
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kyselymäärä / kk:</span>
                <span className="font-medium">{humanCost.monthlyQueries}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Työaika yhteensä:</span>
                <span className="font-medium">{humanCost.humanServiceHours.toFixed(1)} h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Palkkakustannus (€/h):</span>
                <span className="font-medium">{formatCurrency(humanCost.humanServiceHourlyRate)}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground font-semibold">Palkkakustannukset:</span>
                <span className="font-semibold text-primary">{formatCurrency(humanCost.humanServiceCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Porrastettu hinnoittelu:</span>
                <span className="font-medium">{formatCurrency(humanTieredPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Peruskulut:</span>
                <span className="font-medium">{formatCurrency(humanCost.baseCosts)}</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-3 mt-3">
                <span className="font-bold">Yhteensä / kk:</span>
                <span className="font-bold text-primary">{formatCurrency(humanCost.totalProviderCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Täysin bottivetonen malli</CardTitle>
            <CardDescription>Kustannukset kun kaikki hoidetaan botilla</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="providerBotMaintenanceHourlyRate">Ylläpitäjän palkka (€/h)</Label>
                <Input
                  id="providerBotMaintenanceHourlyRate"
                  type="number"
                  value={settings.providerBotMaintenanceHourlyRate}
                  onChange={(e) => updateSettings({ providerBotMaintenanceHourlyRate: Number(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="providerBotMaintenanceHoursPerMonth">Ylläpitotunnit / kk</Label>
                <Input
                  id="providerBotMaintenanceHoursPerMonth"
                  type="number"
                  value={settings.providerBotMaintenanceHoursPerMonth}
                  onChange={(e) => updateSettings({ providerBotMaintenanceHoursPerMonth: Number(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Järjestelmäkustannus (Azure) (€/kk)</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  <span className="text-sm font-semibold">{botSystemCosts.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Arvo tulee alta Palveluntarjoajan porrastuksesta
                </p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kyselymäärä / kk:</span>
                <span className="font-medium">{botCost.monthlyQueries}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ylläpitotunnit / kk:</span>
                <span className="font-medium">{botCost.botMaintenanceHours} h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ylläpitäjän palkka (€/h):</span>
                <span className="font-medium">{formatCurrency(botCost.botMaintenanceHourlyRate)}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground font-semibold">Ylläpitokulut (tunnit):</span>
                <span className="font-semibold text-primary">{formatCurrency(botCost.botMaintenanceCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Järjestelmäkustannus (Azure):</span>
                <span className="font-medium">{formatCurrency(botSystemCosts)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Peruskulut:</span>
                <span className="font-medium">{formatCurrency(botCost.baseCosts)}</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-3 mt-3">
                <span className="font-bold">Yhteensä / kk:</span>
                <span className="font-bold text-primary">{formatCurrency(botCost.totalProviderCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Hybridimallin kuukausittaiset kustannukset</CardTitle>
          <CardDescription>
            Meidän kustannuksemme kun botti hoitaa osan ja ihminen loput
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Kk</th>
                  <th className="text-right py-2">Botti %</th>
                  <th className="text-right py-2">Bot kyselyt</th>
                  <th className="text-right py-2">Ylläpito €</th>
                  <th className="text-right py-2">Ihmis kyselyt</th>
                  <th className="text-right py-2">Työtunnit</th>
                  <th className="text-right py-2">Palkat €</th>
                  <th className="text-right py-2">Tekniset €</th>
                  <th className="text-right py-2 font-bold">Yhteensä €</th>
                </tr>
              </thead>
              <tbody>
                {settings.botGrowth.map(growth => {
                  const calc = calculateProviderHybridMonth(growth.month, settings);
                  return (
                    <tr key={growth.month} className="border-b">
                      <td className="py-2">{growth.month}</td>
                      <td className="text-right">{calc.botPercentage}%</td>
                      <td className="text-right">{calc.botQueries}</td>
                      <td className="text-right">{formatCurrency(calc.botMaintenanceCost)}</td>
                      <td className="text-right">{calc.humanQueries}</td>
                      <td className="text-right">{calc.humanServiceHours.toFixed(1)}</td>
                      <td className="text-right">{formatCurrency(calc.humanServiceCost)}</td>
                      <td className="text-right">{formatCurrency(calc.technicalCosts)}</td>
                      <td className="text-right font-bold text-primary">
                        {formatCurrency(calc.totalMonthlyCost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
