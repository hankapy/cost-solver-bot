import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePricing } from "@/contexts/PricingContext";
import { compareCustomerVsProvider } from "@/lib/providerCalculations";
import { calculateHumanCost, calculateBotCost } from "@/lib/pricingCalculations";

export default function ComparisonTab() {
  const { settings } = usePricing();
  
  const comparison = compareCustomerVsProvider(settings);
  const customerHumanCost = calculateHumanCost(settings);
  const customerBotCost = calculateBotCost(settings, false);
  
  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Asiakas vs. Palveluntarjoaja</h2>
        <p className="text-muted-foreground">
          Vertailu asiakkaan maksujen ja meidän kustannustemme välillä
        </p>
      </div>

      <Card className="shadow-card border-primary">
        <CardHeader>
          <CardTitle>Kate-analyysi (Ihmisvetoinen malli)</CardTitle>
          <CardDescription>
            Mitä asiakas maksaa vs. mitä meille jää käteen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Asiakkaan maksu meille</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(comparison.customerPayment)}
              </p>
              <p className="text-xs text-muted-foreground">
                Tämä on mitä asiakas maksaa palvelusta
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Meidän kustannukset</p>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(comparison.providerCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                Palkat + tekniset kulut
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Kate</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(comparison.margin)}
              </p>
              <p className="text-xs text-muted-foreground">
                Katteemme: {formatPercent(comparison.marginPercentage)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-3">Erittelyt</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">Asiakkaan kustannuserittely:</p>
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
              </div>

              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">Meidän kustannuserittely:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Palkkakustannukset:</span>
                    <span>{formatCurrency(comparison.providerCost - settings.providerTechnicalCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tekniset kulut:</span>
                    <span>{formatCurrency(settings.providerTechnicalCosts)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-medium">
                    <span>Yhteensä:</span>
                    <span>{formatCurrency(comparison.providerCost)}</span>
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
            <CardTitle>Asiakkaan näkökulma</CardTitle>
            <CardDescription>Mitä asiakas maksaa eri malleissa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span className="font-medium">Ihmisvetoinen:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(customerHumanCost.totalCost)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span className="font-medium">Bottivetonen:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(customerBotCost.totalCost)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200">
              <span className="font-medium">Asiakkaan säästö:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(customerHumanCost.totalCost - customerBotCost.totalCost)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Meidän näkökulma</CardTitle>
            <CardDescription>Meidän kustannukset eri malleissa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span className="font-medium">Ihmisvetoinen:</span>
              <span className="text-lg font-bold text-destructive">
                {formatCurrency(comparison.providerCost)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span className="font-medium">Bottivetonen:</span>
              <span className="text-lg font-bold text-destructive">
                {formatCurrency(settings.providerBotMaintenanceHoursPerMonth * settings.providerBotMaintenanceHourlyRate + settings.providerTechnicalCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200">
              <span className="font-medium">Meidän säästö:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(
                  comparison.providerCost - 
                  (settings.providerBotMaintenanceHoursPerMonth * settings.providerBotMaintenanceHourlyRate + settings.providerTechnicalCosts)
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
