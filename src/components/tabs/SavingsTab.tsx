import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePricing } from "@/contexts/PricingContext";
import { calculateSavings } from "@/lib/pricingCalculations";
import { PiggyBank, TrendingDown, Percent } from "lucide-react";

export default function SavingsTab() {
  const { settings } = usePricing();
  const calculation = calculateSavings(settings);

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatPercentage = (value: number) => `${value.toFixed(1)} %`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <PiggyBank className="h-6 w-6 text-success" />
          Säästölaskuri
        </h2>
        <p className="text-muted-foreground">
          Vertailu pelkän ihmistyön ja pelkän botin välillä
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card bg-gradient-card border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ihmistyön kustannus</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(calculation.humanCost)}
            </div>
            <p className="text-xs text-muted-foreground">per kuukausi</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Botin kustannus</CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(calculation.botCost)}
            </div>
            <p className="text-xs text-muted-foreground">per kuukausi</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant bg-gradient-success border-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-success-foreground">
              Kuukausisäästö
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-success-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-foreground">
              {formatCurrency(calculation.savings)}
            </div>
            <p className="text-xs text-success-foreground/90">
              {formatPercentage(calculation.savingsPercentage)} säästö
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Säästöanalyysi</CardTitle>
          <CardDescription>
            Yksityiskohtainen vertailu ihmistyön ja botin välillä
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted border border-border">
              <h4 className="font-semibold mb-3">Laskentaperuste:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Ihmistyön kustannus</strong> = (Kyselymäärä × Käsittelyaika × Tuntihinta) + Peruskuukausihinta (250 €)</p>
                <p><strong>Botin kustannus</strong> = Portaistettu kuukausihinta kyselymäärän mukaan + Järjestelmäkulut</p>
                <p className="text-xs mt-2 italic">Huom: Botin aloitusmaksu ei sisälly vertailuun, koska se on kertaluonteinen kustannus</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 rounded-lg bg-destructive/10">
              <div>
                <p className="text-sm text-muted-foreground">Ihmistyön kustannus</p>
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(calculation.humanCost)}
                </p>
              </div>
            </div>

            <div className="text-center text-2xl font-bold text-muted-foreground">−</div>

            <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
              <div>
                <p className="text-sm text-muted-foreground">Botin kustannus</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(calculation.botCost)}
                </p>
              </div>
            </div>

            <div className="text-center text-2xl font-bold text-muted-foreground">=</div>

            <div className="flex justify-between items-center p-6 rounded-lg bg-gradient-success">
              <div className="flex-1">
                <p className="text-sm text-success-foreground/90">Kuukausisäästö</p>
                <p className="text-3xl font-bold text-success-foreground">
                  {formatCurrency(calculation.savings)}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success-foreground/20">
                <Percent className="h-5 w-5 text-success-foreground" />
                <span className="text-xl font-bold text-success-foreground">
                  {formatPercentage(calculation.savingsPercentage)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t space-y-3">
            <h4 className="font-semibold">Pitkän aikavälin säästöt</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">3 kuukautta</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrency(calculation.savings * 3)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">6 kuukautta</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrency(calculation.savings * 6)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">12 kuukautta</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrency(calculation.savings * 12)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
