import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ExampleTab() {
  const [expertSalary, setExpertSalary] = useState(3000);
  const [expertHours, setExpertHours] = useState(11);
  const [managerSalary, setManagerSalary] = useState(6500);
  const [managerHours, setManagerHours] = useState(1);
  const [overheadPercent, setOverheadPercent] = useState(30);
  const [botBaseFee, setBotBaseFee] = useState(500);
  const [botSystemCost, setBotSystemCost] = useState(150);
  const [botCoveragePercent, setBotCoveragePercent] = useState(50);

  const calculateCosts = () => {
    const expertCost = (expertSalary / 160) * expertHours * (1 + overheadPercent / 100);
    const managerCost = (managerSalary / 160) * managerHours * (1 + overheadPercent / 100);
    const totalWithoutBot = expertCost + managerCost;
    
    const humanWorkRemaining = totalWithoutBot * (1 - botCoveragePercent / 100);
    const totalWithBot = botBaseFee + botSystemCost + humanWorkRemaining;
    const monthlySavings = totalWithoutBot - totalWithBot;

    return {
      expertCost,
      managerCost,
      totalWithoutBot,
      humanWorkRemaining,
      totalWithBot,
      monthlySavings
    };
  };

  const costs = calculateCosts();

  const chartData = [
    {
      name: "Vertailu",
      "Nykyinen tilanne": Math.round(costs.totalWithoutBot),
      "Botin kanssa": Math.round(costs.totalWithBot),
      "Säästö": Math.round(costs.monthlySavings)
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Esimerkki kustannushyödyistä</h2>
        <p className="text-muted-foreground mb-4">
          Tällä välilehdellä voit luoda oman esimerkin kustannuslaskelmasta. Kaikki arvot ovat muokattavia,
          jotta voit testata erilaisia skenaarioita omilla luvuillasi.
        </p>
        <p className="text-muted-foreground">
          Muokkaa alla olevia kenttiä ja katso, miten kustannukset ja säästöt muuttuvat reaaliajassa
          graafissa ja taulukossa.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Muokattavat arvot</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="font-medium">Asiantuntija</h4>
            <div className="space-y-2">
              <Label>Kuukausipalkka (€)</Label>
              <Input
                type="number"
                value={expertSalary}
                onChange={(e) => setExpertSalary(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Työtunnit kuukaudessa</Label>
              <Input
                type="number"
                value={expertHours}
                onChange={(e) => setExpertHours(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Päällikkö</h4>
            <div className="space-y-2">
              <Label>Kuukausipalkka (€)</Label>
              <Input
                type="number"
                value={managerSalary}
                onChange={(e) => setManagerSalary(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Työtunnit kuukaudessa</Label>
              <Input
                type="number"
                value={managerHours}
                onChange={(e) => setManagerHours(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Botin kustannukset</h4>
            <div className="space-y-2">
              <Label>Perusmaksu (€/kk)</Label>
              <Input
                type="number"
                value={botBaseFee}
                onChange={(e) => setBotBaseFee(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Järjestelmäkulu (€/kk)</Label>
              <Input
                type="number"
                value={botSystemCost}
                onChange={(e) => setBotSystemCost(Number(e.target.value))}
              />
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

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Kustannusvertailu</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="Nykyinen tilanne" fill="hsl(var(--destructive))" />
            <Bar dataKey="Botin kanssa" fill="hsl(var(--primary))" />
            <Bar dataKey="Säästö" fill="hsl(var(--success))" />
          </BarChart>
        </ResponsiveContainer>
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
                Asiantuntija (€ {expertSalary.toLocaleString('fi-FI')}, {expertHours} h/kk, sivukuluineen +{overheadPercent} %)
              </TableCell>
              <TableCell className="text-right">{formatCurrency(costs.expertCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Päällikkö (€ {managerSalary.toLocaleString('fi-FI')}, {managerHours} h/kk, sivukuluineen +{overheadPercent} %)
              </TableCell>
              <TableCell className="text-right">{formatCurrency(costs.managerCost)}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-semibold">Kokonaiskustannus ilman bottia</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(costs.totalWithoutBot)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Botin perusmaksu</TableCell>
              <TableCell className="text-right">{formatCurrency(botBaseFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Järjestelmäkulu</TableCell>
              <TableCell className="text-right">{formatCurrency(botSystemCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Ihmisen työksi jää ({100 - botCoveragePercent} %, sivukuluineen +{overheadPercent} %)
              </TableCell>
              <TableCell className="text-right">{formatCurrency(costs.humanWorkRemaining)}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-semibold">Kokonaiskustannus botin kanssa</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(costs.totalWithBot)}</TableCell>
            </TableRow>
            <TableRow className="bg-primary/10">
              <TableCell className="font-bold">Nettosäästö kuukaudessa</TableCell>
              <TableCell className="text-right font-bold text-primary">{formatCurrency(costs.monthlySavings)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <div className="bg-muted/50 p-6 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          <strong>Tulkinta:</strong> Break-even saavutettiin jo ennen {botCoveragePercent}% kattavuutta. 
          Sivukulut huomioidaan ihmistyön kustannuksessa ({costs.totalWithoutBot.toLocaleString('fi-FI', { maximumFractionDigits: 0 })} €/kk) 
          on suurempi kuin botin ja järjestelmän kokonaiskulut ({costs.totalWithBot.toLocaleString('fi-FI', { maximumFractionDigits: 0 })} €/kk). 
          Tällä määrällä säästöä {formatCurrency(costs.monthlySavings)}/kk. 
          Lisäksi on huomioitava kasvatettavissa työtiimeissä käytettävä työtyytyväisyys.
        </p>
      </div>
    </div>
  );
}
