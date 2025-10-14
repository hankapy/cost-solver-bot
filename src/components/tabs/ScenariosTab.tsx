import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePricing } from "@/contexts/PricingContext";
import { 
  calculateProviderHumanCustomerPrice,
  calculateProviderHybridCustomerPrice 
} from "@/lib/providerCalculations";
import { BarChart3, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from "recharts";

export default function ScenariosTab() {
  const { settings } = usePricing();
  
  // Vertailutyökaluun kyselymäärä
  const [comparisonQueries, setComparisonQueries] = useState(settings.monthlyQueries);

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatPercentage = (value: number) => `${value.toFixed(1)} %`;

  // Lasketaan ihmisvetoisen mallin asiakashinta (sama kaikille)
  const humanCustomerPrice = calculateProviderHumanCustomerPrice(settings);

  // Vertailutyökalun data: sama kyselymäärä, eri botin osuudet
  // Käytämme botGrowth-kuukausia jotka vastaavat tiettyjä bottiprosentteja
  const botPercentages = [0, 25, 50, 75, 100];
  const comparisonData = botPercentages.map(botPct => {
    // Etsitään lähin botGrowth-kuukausi joka vastaa tätä prosenttia
    const closestMonth = settings.botGrowth.reduce((prev, curr) => 
      Math.abs(curr.percentage - botPct) < Math.abs(prev.percentage - botPct) 
        ? curr 
        : prev
    );
    
    const hybridPrice = botPct === 0 
      ? humanCustomerPrice 
      : calculateProviderHybridCustomerPrice(closestMonth.month, settings);
    
    const savings = humanCustomerPrice - hybridPrice;
    const savingsPercentage = (savings / humanCustomerPrice) * 100;
    
    return {
      botPercentage: botPct,
      name: `${botPct}%`,
      humanCost: Number(humanCustomerPrice.toFixed(2)),
      hybridCost: Number(hybridPrice.toFixed(2)),
      savings: Number(savings.toFixed(2)),
      savingsPercentage,
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
          Vertaile, miten eri botin osuudet vaikuttavat hintoihin ja säästöihin
        </p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Mitä tämä vertailu näyttää?</CardTitle>
          <CardDescription>
            Ymmärrä, miten botin osuus vaikuttaa asiakashintoihin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <h4 className="font-semibold mb-3">Vertailun idea:</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tämä työkalu näyttää, miten <strong>asiakashinnat ja säästöt muuttuvat</strong>, kun botin 
              osuus kyselyiden käsittelystä kasvaa. Voit asettaa haluamasi kuukausittaisen kyselymäärän 
              ja nähdä, mitä tapahtuu kun botti hoitaa 0%, 25%, 50%, 75% tai 100% kyselyistä.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-3">Miten säästö lasketaan?</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Säästö</strong> = Ihmisvetoisen mallin hinta (0% botti) - Hybridimallin hinta
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
            Hintavertailu
          </CardTitle>
          <CardDescription>
            Aseta kyselymäärä ja näe hintaerot eri bottitasoilla
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="comparisonQueries">Kyselymäärä / kk (ei käytössä tässä versiossa)</Label>
            <Input
              id="comparisonQueries"
              type="number"
              value={comparisonQueries}
              onChange={(e) => setComparisonQueries(Number(e.target.value))}
              min="0"
              className="max-w-xs"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Hinnat lasketaan Akvamariinin asetusten mukaan
            </p>
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
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px'
                }}
              />
              <Bar 
                dataKey="humanCost" 
                name="Ihmisvetoinen malli"
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
                  <TableHead className="text-right">Asiakashinta</TableHead>
                  <TableHead className="text-right">Säästö</TableHead>
                  <TableHead className="text-right">Säästö %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((data) => {
                  const botQueries = Math.round((settings.monthlyQueries * data.botPercentage) / 100);
                  const humanQueries = settings.monthlyQueries - botQueries;
                  
                  return (
                    <TableRow key={data.botPercentage}>
                      <TableCell className="font-medium">{data.botPercentage} %</TableCell>
                      <TableCell>{botQueries}</TableCell>
                      <TableCell>{humanQueries}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(data.hybridCost)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${data.savings >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(data.savings)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${data.savingsPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatPercentage(data.savingsPercentage)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 rounded-lg bg-muted border border-border mt-4">
            <h4 className="font-semibold mb-2">Tulkinta:</h4>
            <p className="text-sm text-muted-foreground">
              Kun botin osuus kasvaa, <strong>asiakashinnat voivat joko laskea tai nousta</strong> riippuen 
              kyselymäärästä ja hinnoittelusta. Positiivinen säästö (vihreä) tarkoittaa, että hybridi on halvempi 
              kuin ihmisvetoinen malli. Negatiivinen säästö (punainen) tarkoittaa, että hybridi on kalliimpi.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
