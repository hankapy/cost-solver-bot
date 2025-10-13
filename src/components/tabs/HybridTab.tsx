import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePricing } from "@/contexts/PricingContext";
import { calculateHybridMonth } from "@/lib/pricingCalculations";
import { GitMerge, Calendar } from "lucide-react";

export default function HybridTab() {
  const { settings } = usePricing();

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatPercentage = (value: number) => `${value.toFixed(0)} %`;

  const months = settings.botGrowth.map(g => g.month);
  const calculations = months.map(month => calculateHybridMonth(month, settings));

  // Vuosilaskuri: laske kustannukset vuosille 0-3
  const calculateYearlyCost = (year: number) => {
    const startMonth = year * 12 + 1;
    const endMonth = Math.min(startMonth + 11, 12);
    
    let totalCost = 0;
    for (let month = startMonth; month <= endMonth; month++) {
      const calc = calculateHybridMonth(month <= 12 ? month : 12, settings);
      totalCost += calc.discountedCost;
    }
    
    return totalCost;
  };

  const yearlyData = [
    { year: 0, cost: calculateYearlyCost(0) },
    { year: 1, cost: calculateYearlyCost(1) },
    { year: 2, cost: calculateYearlyCost(2) },
    { year: 3, cost: calculateYearlyCost(3) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GitMerge className="h-6 w-6 text-primary" />
          Hybridimalli
        </h2>
        <p className="text-muted-foreground">
          Yhdistelmä ihmistyöstä ja botista - botin osuus kasvaa kuukausittain
        </p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Laskentaperuste</CardTitle>
          <CardDescription>
            Miten hybridimallin kustannukset lasketaan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <h4 className="font-semibold mb-3">Kuukausittainen laskentakaava:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">1. Kyselyiden jako:</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Botin kyselyt = Kokonaiskyselyt × (Botin osuus % ÷ 100)
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Ihmisen kyselyt = Kokonaiskyselyt - Botin kyselyt
                </p>
              </div>
              
              <div>
                <p className="font-semibold">2. Botin kustannus:</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Kk 1: Vain aloitusmaksu
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Kk 2+: Portaistettu hinta (botin kyselyiden mukaan) + Järjestelmäkulut
                </p>
              </div>

              <div>
                <p className="font-semibold">3. Ihmistyön kustannus:</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Työtunnit = (Ihmisen kyselyt × Käsittelyaika) ÷ 60
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Ihmiskustannus = (Työtunnit × Tuntihinta) + Peruskuukausihinta
                </p>
              </div>

              <div>
                <p className="font-semibold">4. Kokonaiskustannus:</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Yhdistetty = Botin kustannus + Ihmiskustannus
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Alennettu = Yhdistetty × (1 - Keskittämisalennus % ÷ 100)
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  Keskittämisalennus huomioi synergiahyödyt, kun molemmat kanavat hoidetaan samassa järjestelmässä
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Kuukausittainen kehitys</CardTitle>
          <CardDescription>
            Kustannukset hybridimallissa kun botin osuus kasvaa asteittain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kk</TableHead>
                  <TableHead>Botti %</TableHead>
                  <TableHead>Botti kyselyt</TableHead>
                  <TableHead>Botin hinta</TableHead>
                  <TableHead>Ihminen kyselyt</TableHead>
                  <TableHead>Ihmisen työtunnit</TableHead>
                  <TableHead>Ihmisen kustannus</TableHead>
                  <TableHead>Yhteensä</TableHead>
                  <TableHead className="text-success font-semibold">Alennettu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.map((calc) => (
                  <TableRow key={calc.month}>
                    <TableCell className="font-medium">{calc.month}</TableCell>
                    <TableCell>{formatPercentage(calc.botPercentage)}</TableCell>
                    <TableCell>{calc.botQueries}</TableCell>
                    <TableCell>{formatCurrency(calc.botCost)}</TableCell>
                    <TableCell>{calc.humanQueries}</TableCell>
                    <TableCell>{calc.humanHours.toFixed(2)} h</TableCell>
                    <TableCell>{formatCurrency(calc.humanTotalCost)}</TableCell>
                    <TableCell>{formatCurrency(calc.combinedCost)}</TableCell>
                    <TableCell className="font-bold text-success">
                      {formatCurrency(calc.discountedCost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-sm">Aloituskustannus (Kk 1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(calculations[0]?.discountedCost || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-sm">Lopullinen kustannus (Kk 12)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(calculations[11]?.discountedCost || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-success">
          <CardHeader>
            <CardTitle className="text-sm text-success-foreground">Säästö vuodessa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-foreground">
              {formatCurrency(
                (calculations[0]?.discountedCost || 0) - (calculations[11]?.discountedCost || 0)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Vuosilaskuri
          </CardTitle>
          <CardDescription>
            Kustannukset useamman vuoden aikana (kk 12 taso jatkuu)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vuosi</TableHead>
                  <TableHead>Ajanjakso</TableHead>
                  <TableHead className="text-right">Vuosikustannus</TableHead>
                  <TableHead className="text-right">Kumulatiivinen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearlyData.map((data, index) => {
                  const cumulativeCost = yearlyData
                    .slice(0, index + 1)
                    .reduce((sum, d) => sum + d.cost, 0);
                  
                  return (
                    <TableRow key={data.year}>
                      <TableCell className="font-medium">Vuosi {data.year}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {data.year === 0 ? "Kk 1-12" : `Vuosi ${data.year}`}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(data.cost)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatCurrency(cumulativeCost)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Huom:</strong> Vuoden 0 jälkeen botin osuus pysyy 12. kuukauden tasolla (
              {formatPercentage(calculations[11]?.botPercentage || 0)}). 
              Kuukausikustannus on {formatCurrency(calculations[11]?.discountedCost || 0)}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
