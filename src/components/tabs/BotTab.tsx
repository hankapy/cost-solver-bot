import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePricing } from "@/contexts/PricingContext";
import { calculateBotCost } from "@/lib/pricingCalculations";
import { Bot, Euro, TrendingUp } from "lucide-react";

export default function BotTab() {
  const { settings } = usePricing();
  const calculation = calculateBotCost(settings);

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Botin kustannukset</h2>
        <p className="text-muted-foreground">
          Täysautomaation kustannuslaskenta - botti hoitaa kaikki kyselyt
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kyselymäärä</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculation.monthlyQueries}</div>
            <p className="text-xs text-muted-foreground">kyselyä / kk</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portaistettu hinta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(calculation.tieredPrice)}</div>
            <p className="text-xs text-muted-foreground">kyselymäärän mukaan</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground">Yhteensä</CardTitle>
            <Euro className="h-4 w-4 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-foreground">
              {formatCurrency(calculation.totalCost)}
            </div>
            <p className="text-xs text-primary-foreground/90">per kuukausi</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Kustannuserittely</CardTitle>
          <CardDescription>Yksityiskohtainen kustannuslaskenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-muted-foreground">Portaistettu hinta (kyselymäärän mukaan)</span>
            <span className="font-semibold">{formatCurrency(calculation.tieredPrice)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-muted-foreground">Aloitusmaksu</span>
            <span className="font-semibold">{formatCurrency(calculation.startupFee)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-muted-foreground">Kuukausiveloitus</span>
            <span className="font-semibold">{formatCurrency(calculation.monthlyFee)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-muted-foreground">Järjestelmäkulut</span>
            <span className="font-semibold">{formatCurrency(calculation.systemCosts)}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t-2">
            <span className="text-lg font-bold flex items-center gap-2">
              <Euro className="h-5 w-5 text-primary" />
              Kokonaiskustannus
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(calculation.totalCost)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
