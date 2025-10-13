import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { usePricing } from "@/contexts/PricingContext";
import { getBotTieredPrice } from "@/lib/pricingCalculations";

export default function ExampleTab() {
  const { settings } = usePricing();
  const [expertSalary, setExpertSalary] = useState(3000);
  const [expertHours, setExpertHours] = useState(48);
  const [managerSalary, setManagerSalary] = useState(6500);
  const [managerHours, setManagerHours] = useState(8);
  const [overheadPercent, setOverheadPercent] = useState(30);
  const [estimatedQueries, setEstimatedQueries] = useState(100);
  const [botCoveragePercent, setBotCoveragePercent] = useState(50);

  const calculateCosts = () => {
    const expertCost = (expertSalary / 160) * expertHours * (1 + overheadPercent / 100);
    const managerCost = (managerSalary / 160) * managerHours * (1 + overheadPercent / 100);
    const totalWithoutBot = expertCost + managerCost;

    // Laske botin hinta asetusten mukaan kyselymäärän perusteella
    const botPricing = getBotTieredPrice(estimatedQueries, settings);
    const botMonthlyFee = botPricing.price + botPricing.systemCosts;

    const humanWorkRemaining = totalWithoutBot * (1 - botCoveragePercent / 100);
    const totalWithBot = botMonthlyFee + humanWorkRemaining;
    const monthlySavings = totalWithoutBot - totalWithBot;

    return {
      expertCost,
      managerCost,
      totalWithoutBot,
      botMonthlyFee,
      humanWorkRemaining,
      totalWithBot,
      monthlySavings,
    };
  };

  const costs = calculateCosts();

  const chartData = [
    {
      name: "Nykyinen tilanne",
      Kokonaiskustannus: Math.round(costs.totalWithoutBot),
      "Botin kustannus": 0,
      "Säästö": 0,
    },
    {
      name: "Botin kanssa",
      Kokonaiskustannus: 0,
      "Botin kustannus": Math.round(costs.totalWithBot),
      "Säästö": Math.round(costs.monthlySavings),
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Esimerkki kustannushyödyistä</h2>
        <p className="text-muted-foreground mb-4">
          Tällä välilehdellä voit luoda oman esimerkin kustannuslaskelmasta. Kaikki arvot ovat muokattavia, jotta voit
          testata erilaisia skenaarioita omilla luvuillasi.
        </p>
        <p className="text-muted-foreground">
          Muokkaa alla olevia kenttiä ja katso, miten kustannukset ja säästöt muuttuvat reaaliajassa graafissa ja
          taulukossa.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Muokattavat arvot</h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="font-medium">Asiantuntija</h4>
            <div className="space-y-2">
              <Label>Kuukausipalkka (€)</Label>
              <Input type="number" value={expertSalary} onChange={(e) => setExpertSalary(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Työtunnit/kk</Label>
              <Input type="number" value={expertHours} onChange={(e) => setExpertHours(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Päällikkö</h4>
            <div className="space-y-2">
              <Label>Kuukausipalkka (€)</Label>
              <Input type="number" value={managerSalary} onChange={(e) => setManagerSalary(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Työtunnit/kk</Label>
              <Input type="number" value={managerHours} onChange={(e) => setManagerHours(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Botin asetukset</h4>
            <div className="space-y-2">
              <Label>Arvioitu kyselymäärä (kk)</Label>
              <Input
                type="number"
                value={estimatedQueries}
                onChange={(e) => setEstimatedQueries(Number(e.target.value))}
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Botin hinta lasketaan Asetukset-välilehden portaiden mukaan
              </p>
            </div>
            <div className="space-y-2">
              <Label>Botin kattavuus (%)</Label>
              <Input
                type="number"
                value={botCoveragePercent}
                onChange={(e) => setBotCoveragePercent(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Muut asetukset</h4>
            <div className="space-y-2">
              <Label>Sivukulut (%)</Label>
              <Input
                type="number"
                value={overheadPercent}
                onChange={(e) => setOverheadPercent(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-elegant">
        <h3 className="text-xl font-semibold mb-6">Kustannusvertailu</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={100}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 14, fontWeight: 500 }}
                angle={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: '€', angle: 0, position: 'top', offset: 10 }}
                tickFormatter={(value) => value.toLocaleString('fi-FI')}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
              />
              <Bar 
                dataKey="Kokonaiskustannus" 
                fill="hsl(var(--destructive))"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="Botin kustannus" 
                stackId="stack"
                fill="hsl(var(--primary))"
              />
              <Bar 
                dataKey="Säästö" 
                stackId="stack"
                fill="hsl(var(--success))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Kustannuserittely</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Eri kuluerät</TableHead>
              <TableHead className="text-right font-semibold">Arvo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Asiantuntija (€ {expertSalary.toLocaleString("fi-FI")}, {expertHours} h/kk)
              </TableCell>
              <TableCell className="text-right">{formatCurrency(costs.expertCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Päällikkö (€ {managerSalary.toLocaleString("fi-FI")}, {managerHours} h/kk)
              </TableCell>
              <TableCell className="text-right">{formatCurrency(costs.managerCost)}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-semibold">Kokonaiskustannus ilman bottia</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(costs.totalWithoutBot)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Botin kuukausimaksu ({estimatedQueries} kyselyä/kk)</TableCell>
              <TableCell className="text-right">{formatCurrency(costs.botMonthlyFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ihmisen työksi jää ({100 - botCoveragePercent} %)</TableCell>
              <TableCell className="text-right">{formatCurrency(costs.humanWorkRemaining)}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-semibold">Kokonaiskustannus botin kanssa</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(costs.totalWithBot)}</TableCell>
            </TableRow>
            <TableRow className="bg-primary/10">
              <TableCell className="font-bold">Nettosäästö kuukaudessa</TableCell>
              <TableCell className="text-right font-bold text-primary">
                {formatCurrency(costs.monthlySavings)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <div className="bg-muted/50 p-6 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          <strong>Huomio:</strong> Kaikki ihmistyön kustannukset sisältävät sivukulut ({overheadPercent}%). Break-even
          saavutettiin jo ennen {botCoveragePercent}% kattavuutta. Ihmistyön kokonaiskustannus (
          {formatCurrency(costs.totalWithoutBot)}/kk) on suurempi kuin botin ja jäljelle jäävän ihmistyön yhteiskulut (
          {formatCurrency(costs.totalWithBot)}/kk). Säästö kuukaudessa: {formatCurrency(costs.monthlySavings)}. Lisäksi
          on huomioitava kasvatettavissa työtiimeissä käytettävä työtyytyväisyys.
        </p>
      </div>
    </div>
  );
}
