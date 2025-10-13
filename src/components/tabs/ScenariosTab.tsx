import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePricing } from "@/contexts/PricingContext";
import { calculateScenario } from "@/lib/pricingCalculations";
import { BarChart3, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from "recharts";

export default function ScenariosTab() {
  const { settings } = usePricing();
  
  // Vertailutyökaluun kyselymäärä
  const [comparisonQueries, setComparisonQueries] = useState(200);

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatPercentage = (value: number) => `${value.toFixed(1)} %`;

  // Vertailutyökalun data: sama kyselymäärä, eri botin osuudet
  const botPercentages = [0, 25, 50, 75, 100];
  const comparisonData = botPercentages.map(botPct => {
    const scenario = calculateScenario(comparisonQueries, botPct, settings);
    return {
      botPercentage: botPct,
      name: `${botPct}%`,
      humanCost: Number(scenario.humanCost.toFixed(2)),
      hybridCost: Number(scenario.hybridCost.toFixed(2)),
      savings: Number(scenario.savings.toFixed(2)),
      savingsPercentage: scenario.savingsPercentage,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Botin osuuden vaikutus
        </h2>
        <p className="text-muted-foreground">
          Vertaile, miten eri botin osuudet vaikuttavat kustannuksiin ja säästöihin
        </p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Mitä tämä vertailu näyttää?</CardTitle>
          <CardDescription>
            Ymmärrä, miten automatisaation taso vaikuttaa kustannuksiin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <h4 className="font-semibold mb-3">Vertailun idea:</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tämä työkalu näyttää, miten <strong>kustannukset ja säästöt muuttuvat</strong>, kun botin 
              osuus kyselyiden käsittelystä kasvaa. Voit asettaa haluamasi kuukausittaisen kyselymäärän 
              ja nähdä, mitä tapahtuu kun botti hoitaa 0%, 25%, 50%, 75% tai 100% kyselyistä.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-3">Miten säästö lasketaan?</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Säästö</strong> = Pelkän ihmistyön kustannus (0% botti) - Hybridimallin kustannus
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Kun botin osuus kasvaa, säästö kasvaa, koska botti hoitaa kyselyt halvemmalla kuin ihminen.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Kustannusvertailu
          </CardTitle>
          <CardDescription>
            Aseta kyselymäärä ja näe kustannuserot eri automatisointiasteilla
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="comparisonQueries">Kyselymäärä / kk</Label>
            <Input
              id="comparisonQueries"
              type="number"
              value={comparisonQueries}
              onChange={(e) => setComparisonQueries(Number(e.target.value))}
              min="0"
              className="max-w-xs"
            />
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
                label={{ 
                  value: 'Botin osuus', 
                  position: 'insideBottom', 
                  offset: -5,
                  style: { fill: 'hsl(var(--foreground))' }
                }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
                label={{ 
                  value: 'Kustannus (€)', 
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
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px'
                }}
              />
              <Bar 
                dataKey="humanCost" 
                name="Pelkkä ihminen"
                fill="hsl(var(--destructive))" 
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="hybridCost" 
                name="Hybridi (botti + ihminen)"
                fill="hsl(var(--primary))" 
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="savings" 
                name="Säästö"
                fill="hsl(var(--success))" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="overflow-x-auto mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Botin osuus</TableHead>
                  <TableHead>Bottikyselyt</TableHead>
                  <TableHead>Ihminen kyselyt</TableHead>
                  <TableHead className="text-right">Kustannus</TableHead>
                  <TableHead className="text-right text-success">Säästö</TableHead>
                  <TableHead className="text-right text-success">Säästö %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((data) => {
                  const botQueries = Math.round((comparisonQueries * data.botPercentage) / 100);
                  const humanQueries = comparisonQueries - botQueries;
                  
                  return (
                    <TableRow key={data.botPercentage}>
                      <TableCell className="font-medium">{data.botPercentage} %</TableCell>
                      <TableCell>{botQueries}</TableCell>
                      <TableCell>{humanQueries}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(data.hybridCost)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-success">
                        {formatCurrency(data.savings)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-success">
                        {formatPercentage(data.savingsPercentage)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 rounded-lg bg-success/5 border border-success/20 mt-4">
            <h4 className="font-semibold mb-2 text-success">Tulkinta:</h4>
            <p className="text-sm text-muted-foreground">
              Kun botin osuus kasvaa, <strong>kokonaiskustannukset laskevat ja säästö kasvaa</strong>. 
              Esimerkiksi {comparisonQueries} kyselyllä kuukaudessa näet tarkalleen, kuinka paljon säästät 
              eri automatisointiasteilla verrattuna pelkkään ihmistyöhön.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
