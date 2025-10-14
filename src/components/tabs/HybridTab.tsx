import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePricing } from "@/contexts/PricingContext";
import { 
  calculateProviderHybridMonth,
  calculateProviderHumanCustomerPrice,
  calculateProviderHybridCustomerPrice 
} from "@/lib/providerCalculations";
import { GitMerge, Calendar, PiggyBank } from "lucide-react";

export default function HybridTab() {
  const { settings, updateSettings } = usePricing();

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatPercentage = (value: number) => `${value.toFixed(0)} %`;

  const months = settings.botGrowth.map(g => g.month);
  const calculations = months.map(month => calculateProviderHybridMonth(month, settings));
  
  // Laske pelkän ihmisvetoisen mallin asiakashinta (sama joka kuukausi)
  const humanCustomerPrice = calculateProviderHumanCustomerPrice(settings);
  const humanYearlyCost = humanCustomerPrice * 12;
  
  // Laske hybridimallin asiakashinnat jokaiselle kuukaudelle
  const hybridMonthlyPrices = months.map(month => 
    calculateProviderHybridCustomerPrice(month, settings)
  );
  const hybridYearlyCost = hybridMonthlyPrices.reduce((sum, price) => sum + price, 0);
  
  // Säästö = pelkkä ihmisvetoinen - hybridi
  const yearlySavings = humanYearlyCost - hybridYearlyCost;

  // Vuosilaskuri: laske kustannukset vuosille 0-3
  const calculateYearlyCost = (year: number) => {
    // Vuosi 0: käytetään kuukausitason arvoja (kk 1-12)
    if (year === 0) {
      return hybridYearlyCost;
    }
    
    // Vuodet 1-3: käytetään 12. kuukauden tasoa (koska botti on saavuttanut vakiotason)
    const month12Price = calculateProviderHybridCustomerPrice(12, settings);
    return month12Price * 12;
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
          Hybridimalli - Asiakashinta
        </h2>
        <p className="text-muted-foreground">
          Akvamariinin hinnoittelu hybridimallille - botin osuus kasvaa kuukausittain
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

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Kuukausittainen kehitys</CardTitle>
          <CardDescription>
            Asiakashinnat hybridimallissa kun botin osuus kasvaa asteittain
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
                  <TableHead>Ihmiskyselyt</TableHead>
                  <TableHead>Ihmisen työtunnit</TableHead>
                  <TableHead>Akvamariinin kustannus</TableHead>
                  <TableHead>Kate €</TableHead>
                  <TableHead className="text-primary font-semibold">Asiakashinta €/kk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.map((calc, index) => {
                  const customerPrice = hybridMonthlyPrices[index];
                  const margin = customerPrice - calc.totalMonthlyCost;
                  
                  return (
                    <TableRow key={calc.month}>
                      <TableCell className="font-medium">{calc.month}</TableCell>
                      <TableCell>{formatPercentage(calc.botPercentage)}</TableCell>
                      <TableCell>{calc.botQueries}</TableCell>
                      <TableCell>{calc.humanQueries}</TableCell>
                      <TableCell>{calc.humanServiceHours.toFixed(2)} h</TableCell>
                      <TableCell>{formatCurrency(calc.totalMonthlyCost)}</TableCell>
                      <TableCell className="text-success">{formatCurrency(margin)}</TableCell>
                      <TableCell className="font-bold text-primary">
                        {formatCurrency(customerPrice)}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
              Verrattuna ihmisvetoiseen malliin (12 kuukautta)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-foreground">
              {formatCurrency(yearlySavings)}
            </div>
            <p className="text-sm text-success-foreground/80 mt-2">
              Ihmisvetoinen: {formatCurrency(humanYearlyCost)} - Hybridi: {formatCurrency(hybridYearlyCost)}
            </p>
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
            Asiakashinnat useamman vuoden aikana (kk 12 taso jatkuu)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vuosi</TableHead>
                  <TableHead>Ajanjakso</TableHead>
                  <TableHead className="text-right">Vuoden asiakashinta</TableHead>
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
              <strong>Huom:</strong> Vuosi 0 näyttää ensimmäisen 12 kuukauden asiakashinnan kuukausitason kehityksen mukaan. 
              Vuodet 1-3 käyttävät 12. kuukauden tasoa, jolloin botti hoitaa {settings.botGrowth[11]?.percentage || 50}% kyselyistä.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Hinnoittelulogiikka</CardTitle>
          <CardDescription>
            Miten Akvamariinin hybridimallin asiakashinta muodostuu
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
                <p className="font-semibold">2. Akvamariinin kustannukset:</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Botin ylläpitokulut = Ylläpitotunnit (porrastettu) × Ylläpitäjän tuntihinta
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Ihmistyökulut = (Ihmisen työtunnit × Tuntihinta) + Porrastettu hinnoittelu
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Järjestelmäkulut + Peruskulut
                </p>
              </div>

              <div>
                <p className="font-semibold">3. Asiakashinta:</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Asiakashinta = Akvamariinin kokonaiskustannus ÷ (1 - Kateprosentti)
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  Kateprosentti: {settings.providerMarginPercentage}%
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-3">Esimerkkikaava kuukaudelle 12:</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {(() => {
                const calc = calculations[11]; // Kuukausi 12
                const customerPrice = hybridMonthlyPrices[11];
                const margin = customerPrice - calc.totalMonthlyCost;
                
                return (
                  <>
                    <p>Botti hoitaa: {calc.botQueries} kyselyä ({calc.botPercentage}%)</p>
                    <p>Ihminen hoitaa: {calc.humanQueries} kyselyä ({100 - calc.botPercentage}%)</p>
                    <p>Botin ylläpitokulut: {formatCurrency(calc.botMaintenanceCost)}</p>
                    <p>Ihmistyökulut: {formatCurrency(calc.humanServiceCost)}</p>
                    <p>Akvamariinin kustannus yhteensä: {formatCurrency(calc.totalMonthlyCost)}</p>
                    <p className="font-semibold text-foreground pt-2">
                      Asiakashinta = {formatCurrency(calc.totalMonthlyCost)} ÷ (1 - {settings.providerMarginPercentage}%) = {formatCurrency(customerPrice)}
                    </p>
                    <p className="text-success">Kate: {formatCurrency(margin)}</p>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
