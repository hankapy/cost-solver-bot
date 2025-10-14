import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePricing } from "@/contexts/PricingContext";
import { 
  calculateProviderBotCost,
  calculateProviderBotCustomerPrice 
} from "@/lib/providerCalculations";
import { Bot, Euro, TrendingUp } from "lucide-react";

export default function BotTab() {
  const { settings, updateSettings } = usePricing();
  const providerCost = calculateProviderBotCost(settings);
  const customerPrice = calculateProviderBotCustomerPrice(settings);
  const margin = customerPrice - providerCost.totalProviderCost;

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bottivetonen malli - Asiakashinta</h2>
        <p className="text-muted-foreground">
          Akvamariinin hinnoittelu bottivetoiselle mallille (kustannukset + kateprosentti)
        </p>
      </div>

      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-lg">Arvioitu kyselymäärä</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="monthlyQueries">Kyselyt / kk</Label>
            <Input
              id="monthlyQueries"
              type="number"
              min="1"
              value={settings.monthlyQueries}
              onChange={(e) => updateSettings({ monthlyQueries: parseInt(e.target.value) || 1 })}
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kyselymäärä</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerCost.monthlyQueries}</div>
            <p className="text-xs text-muted-foreground">kyselyä / kk</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ylläpitotunnit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerCost.botMaintenanceHours} h</div>
            <p className="text-xs text-muted-foreground">kuukaudessa</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Järjestelmäkulut</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(providerCost.botMaintenanceFixedCost)}</div>
            <p className="text-xs text-muted-foreground">Azure / kk</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Hinnoitteluerittely</CardTitle>
          <CardDescription>Yksityiskohtainen hintarakenne</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 mb-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm">Akvamariinin kustannukset:</h4>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Ylläpitäjän työvoimakustannus (€/h)</span>
              <span className="font-semibold">{formatCurrency(providerCost.botMaintenanceHourlyRate)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Ylläpitotunnit / kk</span>
              <span className="font-semibold">{providerCost.botMaintenanceHours} h</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Ylläpitokulut yhteensä</span>
              <span className="font-semibold">{formatCurrency(providerCost.botMaintenanceCost)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Järjestelmäkustannus (Azure)</span>
              <span className="font-semibold">{formatCurrency(providerCost.botMaintenanceFixedCost)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Peruskulut</span>
              <span className="font-semibold">{formatCurrency(providerCost.baseCosts)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2">
              <span className="font-bold">Kustannus yhteensä</span>
              <span className="font-bold text-primary">{formatCurrency(providerCost.totalProviderCost)}</span>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-sm">Asiakashinnoittelu:</h4>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Kateprosentti (%)</span>
              <span className="font-semibold">{settings.providerMarginPercentage}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Kate (€)</span>
              <span className="font-semibold text-success">{formatCurrency(margin)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2">
              <span className="text-lg font-bold flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                Asiakashinta / kk
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(customerPrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Hinnoittelulogiikka</CardTitle>
          <CardDescription>
            Miten Akvamariinin asiakashinta muodostuu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <h4 className="font-semibold mb-3">Laskentakaava:</h4>
            <div className="space-y-2 text-sm">
              <p className="font-mono bg-background p-2 rounded">
                Asiakashinta = Akvamariinin kustannus ÷ (1 - Kateprosentti)
              </p>
              <p className="font-mono bg-background p-2 rounded">
                Akvamariinin kustannus = Ylläpitokulut + Järjestelmäkustannus + Peruskulut
              </p>
              <p className="font-mono bg-background p-2 rounded">
                Ylläpitokulut = Ylläpitotunnit × Ylläpitäjän tuntihinta
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-3">Esimerkkikaava nykyisillä arvoilla:</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Ylläpitotunnit = {providerCost.botMaintenanceHours} h (porrastettu kyselymäärän mukaan)</p>
              <p>Ylläpitokulut = {providerCost.botMaintenanceHours} h × {formatCurrency(providerCost.botMaintenanceHourlyRate)}/h = {formatCurrency(providerCost.botMaintenanceCost)}</p>
              <p>Akvamariinin kustannus = {formatCurrency(providerCost.botMaintenanceCost)} + {formatCurrency(providerCost.botMaintenanceFixedCost)} + {formatCurrency(providerCost.baseCosts)} = {formatCurrency(providerCost.totalProviderCost)}</p>
              <p className="font-semibold text-foreground pt-2">Asiakashinta = {formatCurrency(providerCost.totalProviderCost)} ÷ (1 - {settings.providerMarginPercentage}%) = {formatCurrency(customerPrice)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
