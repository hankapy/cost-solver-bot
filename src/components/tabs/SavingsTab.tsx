import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePricing } from "@/contexts/PricingContext";
import { calculateSavings, calculateScenario } from "@/lib/pricingCalculations";
import { PiggyBank, TrendingDown, Percent, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SavingsTab() {
  const { settings } = usePricing();
  const calculation = calculateSavings(settings);
  
  // Interaktiivinen laskuri
  const [calculatorQueries, setCalculatorQueries] = useState(200);
  const [calculatorBotPercentage, setCalculatorBotPercentage] = useState(50);
  
  // Laske interaktiivisen laskurin arvot
  const calculatorScenario = calculateScenario(calculatorQueries, calculatorBotPercentage, settings);
  
  // Valmista data graafille
  const chartData = [
    {
      name: '100% Ihminen',
      Hinta: Number(calculatorScenario.humanCost.toFixed(2)),
    },
    {
      name: `${calculatorBotPercentage}% Botti`,
      Hinta: Number(calculatorScenario.hybridCost.toFixed(2)),
    },
  ];

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
          Vertailu eri palvelumallien hintojen välillä asiakkaan näkökulmasta
        </p>
      </div>

      <Card className="shadow-elegant border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Perusasetukset
          </CardTitle>
          <CardDescription>
            Valitse kyselymäärä ja botin osuus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="savingsQueries">Kyselymäärä / kk</Label>
              <Input
                id="savingsQueries"
                type="number"
                value={calculatorQueries}
                onChange={(e) => setCalculatorQueries(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="savingsBotPercentage">Botin osuus (%)</Label>
              <Input
                id="savingsBotPercentage"
                type="number"
                value={calculatorBotPercentage}
                onChange={(e) => setCalculatorBotPercentage(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card bg-gradient-card border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ihmisvetoinen malli</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(calculation.humanCost)}
            </div>
            <p className="text-xs text-muted-foreground">asiakashinta / kk</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bottivetonen malli</CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(calculation.botCost)}
            </div>
            <p className="text-xs text-muted-foreground">asiakashinta / kk</p>
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
            Yksityiskohtainen vertailu eri palvelumallien hintojen välillä
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted border border-border">
              <h4 className="font-semibold mb-3">Hinnoittelu:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Ihmisvetoinen malli</strong> = Portaistettu kuukausihinta kyselymäärän mukaan + Tuntiveloitus</p>
                <p><strong>Bottivetonen malli</strong> = Portaistettu kuukausihinta kyselymäärän mukaan + Järjestelmäkulut</p>
                <p className="text-xs mt-2 italic">Huom: Botin aloitusmaksu ei sisälly vertailuun, koska se on kertaluonteinen kustannus</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 rounded-lg bg-destructive/10">
              <div>
                <p className="text-sm text-muted-foreground">Ihmisvetoinen malli</p>
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(calculation.humanCost)}
                </p>
              </div>
            </div>

            <div className="text-center text-2xl font-bold text-muted-foreground">−</div>

            <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
              <div>
                <p className="text-sm text-muted-foreground">Bottivetonen malli</p>
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

      <Card className="shadow-elegant border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Interaktiivinen säästölaskuri
          </CardTitle>
          <CardDescription>
            Kokeile eri kyselymääriä ja botin osuuksia nähdäksesi säästöt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="calculatorQueries">Kyselymäärä / kk</Label>
              <Input
                id="calculatorQueries"
                type="number"
                value={calculatorQueries}
                onChange={(e) => setCalculatorQueries(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calculatorBotPercentage">Botin osuus (%)</Label>
              <Input
                id="calculatorBotPercentage"
                type="number"
                value={calculatorBotPercentage}
                onChange={(e) => setCalculatorBotPercentage(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
                label={{ 
                  value: 'Asiakashinta (€)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'hsl(var(--foreground))' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `${value.toFixed(2)} €`}
              />
              <Bar 
                dataKey="Hinta" 
                fill="hsl(var(--primary))" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-muted-foreground mb-1">Pelkkä ihmistyö</p>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(calculatorScenario.humanCost)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">
                Hybridi ({calculatorBotPercentage}% botti)
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(calculatorScenario.hybridCost)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm text-muted-foreground mb-1">Kuukausisäästö</p>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(calculatorScenario.savings)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercentage(calculatorScenario.savingsPercentage)} säästö
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted border border-border">
            <h4 className="font-semibold mb-3">Laskelma ({calculatorQueries} kyselyä/kk):</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Botti hoitaa: <strong>{Math.round(calculatorQueries * calculatorBotPercentage / 100)} kyselyä</strong> ({calculatorBotPercentage}%)</p>
              <p>• Ihminen hoitaa: <strong>{calculatorQueries - Math.round(calculatorQueries * calculatorBotPercentage / 100)} kyselyä</strong> ({100 - calculatorBotPercentage}%)</p>
              <p className="pt-2 border-t mt-2">
                💰 Kun botti hoitaa {calculatorBotPercentage}% kyselyistä, <strong className="text-success">säästät {formatCurrency(calculatorScenario.savings)} kuukaudessa</strong> verrattuna ihmisvetoiseen malliin.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
