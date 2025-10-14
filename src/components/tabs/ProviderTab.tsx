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
                <Label htmlFor="providerHumanWorkCost">Työaikakustannus (€/kk)</Label>
                <Input
                  id="providerHumanWorkCost"
                  type="number"
                  value={settings.providerHumanWorkCost}
                  onChange={(e) => updateSettings({ providerHumanWorkCost: Number(e.target.value) })}
                  min="0"
                />
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
                <span className="text-muted-foreground">Työaikakustannus:</span>
                <span className="font-medium">{formatCurrency(humanCost.humanWorkCost)}</span>
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
                <Label htmlFor="providerBotMaintenanceCost">Ylläpitokustannus (€/kk)</Label>
                <Input
                  id="providerBotMaintenanceCost"
                  type="number"
                  value={settings.providerBotMaintenanceCost}
                  onChange={(e) => updateSettings({ providerBotMaintenanceCost: Number(e.target.value) })}
                  min="0"
                />
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
                <span className="text-muted-foreground">Ylläpitokustannus (kiinteä):</span>
                <span className="font-medium">{formatCurrency(botCost.botMaintenanceFixedCost)}</span>
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
