import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePricing } from "@/contexts/PricingContext";
import { 
  calculateProviderHumanCost,
  calculateProviderHumanCustomerPrice 
} from "@/lib/providerCalculations";
import { Euro, Clock, Calculator } from "lucide-react";

export default function HumanTab() {
  const { settings, updateSettings } = usePricing();
  const providerCost = calculateProviderHumanCost(settings);
  const customerPrice = calculateProviderHumanCustomerPrice(settings);
  const margin = customerPrice - providerCost.totalProviderCost;

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatHours = (value: number) => `${value.toFixed(2)} h`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ihmisvetoinen malli - Asiakashinta</h2>
        <p className="text-muted-foreground">
          Akvamariinin hinnoittelu ihmisvetoiselle mallille (kustannukset + kateprosentti)
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kyselymäärä</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerCost.monthlyQueries}</div>
            <p className="text-xs text-muted-foreground">kyselyä / kk</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kokonaistyöaika</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatHours(providerCost.humanServiceHours)}</div>
            <p className="text-xs text-muted-foreground">{(providerCost.humanServiceHours * 60).toFixed(0)} min</p>
          </CardContent>
        </Card>
      </div>

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
                Akvamariinin kustannus = Työvoimakustannus + Porrastettu hinnoittelu + Peruskulut
              </p>
              <p className="font-mono bg-background p-2 rounded">
                Työvoimakustannus = Työtunnit × Tuntihinta
              </p>
              <p className="font-mono bg-background p-2 rounded">
                Työtunnit = (Kyselymäärä × Käsittelyaika minuutteina) ÷ 60
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-3">Esimerkkikaava nykyisillä arvoilla:</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Työtunnit = ({providerCost.monthlyQueries} kyselyä × {settings.minutesPerQuery} min) ÷ 60 = {formatHours(providerCost.humanServiceHours)}</p>
              <p>Työvoimakustannus = {formatHours(providerCost.humanServiceHours)} × {formatCurrency(providerCost.humanServiceHourlyRate)}/h = {formatCurrency(providerCost.humanServiceCost)}</p>
              <p>Akvamariinin kustannus = {formatCurrency(providerCost.humanServiceCost)} + {formatCurrency(providerCost.humanWorkCost)} + {formatCurrency(providerCost.baseCosts)} = {formatCurrency(providerCost.totalProviderCost)}</p>
              <p className="font-semibold text-foreground pt-2">Asiakashinta = {formatCurrency(providerCost.totalProviderCost)} ÷ (1 - {settings.providerMarginPercentage}%) = {formatCurrency(customerPrice)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Hinnoitteluerittely</CardTitle>
          <CardDescription>Yksityiskohtainen hintarakenne</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 mb-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm">Akvamariinin kustannukset:</h4>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Työvoimakustannus (€/h)</span>
              <span className="font-semibold">{formatCurrency(providerCost.humanServiceHourlyRate)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Työaika / vastaus</span>
              <span className="font-semibold">{settings.minutesPerQuery} min</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Työvoimakustannukset yhteensä</span>
              <span className="font-semibold">{formatCurrency(providerCost.humanServiceCost)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground text-sm">Porrastettu hinnoittelu</span>
              <span className="font-semibold">{formatCurrency(providerCost.humanWorkCost)}</span>
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
    </div>
  );
}
