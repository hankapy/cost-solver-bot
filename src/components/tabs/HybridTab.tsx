import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePricing } from "@/contexts/PricingContext";
import { calculateHybridMonth, getBotTieredPrice, getHumanTieredBasePrice, calculateHumanCost } from "@/lib/pricingCalculations";
import { GitMerge, Calendar, PiggyBank } from "lucide-react";

export default function HybridTab() {
  const { settings, updateSettings } = usePricing();

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatPercentage = (value: number) => `${value.toFixed(0)} %`;

  const months = settings.botGrowth.map(g => g.month);
  const calculations = months.map(month => calculateHybridMonth(month, settings));
  
  // Laske pelkän ihmistyön vuosikustannus vertailua varten
  const humanYearlyCost = calculateHumanCost(settings).totalCost * 12;
  // Laske hybridimallin todellinen vuosikustannus (summaa kaikki 12 kuukautta)
  const hybridYearlyCost = calculations.reduce((sum, calc) => sum + calc.discountedCost, 0);
  // Säästö = pelkkä ihmistyö - hybridi
  const yearlySavings = humanYearlyCost - hybridYearlyCost;

  // Vuosilaskuri: laske kustannukset vuosille 0-3
  const calculateYearlyCost = (year: number) => {
    // Vuosi 0: käytetään kuukausitason arvoja (kk 1-12)
    if (year === 0) {
      let totalCost = 0;
      for (let month = 1; month <= 12; month++) {
        const calc = calculateHybridMonth(month, settings);
        totalCost += calc.discountedCost;
      }
      return totalCost;
    }
    
    // Vuodet 1-3: käytetään vuositason botin osuutta
    const yearlyGrowth = settings.botYearlyGrowth.find(g => g.year === year);
    const botPercentage = yearlyGrowth?.percentage || settings.botGrowth[11].percentage;
    
    const botQueries = Math.round((settings.monthlyQueries * botPercentage) / 100);
    const humanQueries = settings.monthlyQueries - botQueries;
    
    const botTieredData = getBotTieredPrice(botQueries, settings);
    const botMonthlyCost = botTieredData.price + botTieredData.systemCosts;
    
    const humanMinutes = humanQueries * settings.minutesPerQuery;
    const humanHours = humanMinutes / 60;
    const humanLaborCost = humanHours * settings.humanHourlyRate;
    const humanBasePrice = getHumanTieredBasePrice(humanQueries, settings);
    const humanTotalCost = humanLaborCost + humanBasePrice;
    
    const combinedCost = botMonthlyCost + humanTotalCost;
    const monthlyCost = combinedCost * (1 - settings.centralizationDiscount / 100);
    
    return monthlyCost * 12; // Koko vuoden kustannus
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

      <Card className="shadow-card border-primary/20">
        <CardHeader>
          <CardTitle>Keskittämisalennus</CardTitle>
          <CardDescription>
            Alennus, joka huomioi synergiahyödyt kun molemmat kanavat hoidetaan samassa järjestelmässä
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="centralizationDiscount">Alennus (%)</Label>
            <Input
              id="centralizationDiscount"
              type="number"
              value={settings.centralizationDiscount}
              onChange={(e) => updateSettings({ centralizationDiscount: Number(e.target.value) })}
              min="0"
              max="100"
            />
            <p className="text-xs text-muted-foreground">
              Tämä alennus vähennetään hybridimallin kokonaiskustannuksista
            </p>
          </div>
        </CardContent>
      </Card>

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
                  <TableHead>Bottikyselyt</TableHead>
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

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="shadow-card bg-gradient-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-success-foreground" />
              Säästö vuodessa
            </CardTitle>
            <CardDescription className="text-success-foreground/80">
              Verrattuna pelkkään ihmistyöhön (12 kuukautta)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-foreground">
              {formatCurrency(yearlySavings)}
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
              <strong>Huom:</strong> Vuosi 0 näyttää ensimmäisen 12 kuukauden kokonaiskustannukset kuukausitason kehityksen mukaan. 
              Vuodet 1-3 käyttävät asetuksissa määritettyjä vuositason botin osuuksia ja laskevat koko vuoden kustannukset.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
