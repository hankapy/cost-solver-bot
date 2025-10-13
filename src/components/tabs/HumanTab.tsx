import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePricing } from "@/contexts/PricingContext";
import { calculateHumanCost } from "@/lib/pricingCalculations";
import { Euro, Clock, Calculator } from "lucide-react";

export default function HumanTab() {
  const { settings } = usePricing();
  const calculation = calculateHumanCost(settings);

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatHours = (value: number) => `${value.toFixed(2)} h`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ihmistyön kustannukset</h2>
        <p className="text-muted-foreground">
          Pelkän ihmistyön kustannuslaskenta kaikille kyselyille
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kyselymäärä</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculation.monthlyQueries}</div>
            <p className="text-xs text-muted-foreground">kyselyä / kk</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Työaika / vastaus</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculation.minutesPerQuery}</div>
            <p className="text-xs text-muted-foreground">minuuttia</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kokonaistyöaika</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatHours(calculation.totalHours)}</div>
            <p className="text-xs text-muted-foreground">{calculation.totalMinutes} min</p>
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
            <span className="text-muted-foreground">Tuntiveloitus</span>
            <span className="font-semibold">{formatCurrency(calculation.hourlyRate)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-muted-foreground">Tuntityön kustannus</span>
            <span className="font-semibold">{formatCurrency(calculation.hourlyLabor)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-muted-foreground">Perushinta / kk</span>
            <span className="font-semibold">{formatCurrency(calculation.basePrice)}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t-2">
            <span className="text-lg font-bold flex items-center gap-2">
              <Euro className="h-5 w-5 text-destructive" />
              Kokonaiskustannus
            </span>
            <span className="text-2xl font-bold text-destructive">
              {formatCurrency(calculation.totalCost)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
