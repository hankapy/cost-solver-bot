import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { usePricing } from "@/contexts/PricingContext";
import { 
  calculateProviderHumanCustomerPrice, 
  calculateProviderBotCustomerPrice,
  calculateProviderHybridCustomerPrice 
} from "@/lib/providerCalculations";

export default function ExampleTab() {
  const { settings } = usePricing();
  const [estimatedQueries, setEstimatedQueries] = useState(100);
  const [selectedMonth, setSelectedMonth] = useState(6); // Kuukausi hybridimallille

  const calculateCosts = () => {
    // Käytämme Akvamariinin hinnoittelua
    const customSettings = { ...settings, monthlyQueries: estimatedQueries };
    
    // Ihmisvetoinen malli - asiakashinta
    const humanPrice = calculateProviderHumanCustomerPrice(customSettings);
    
    // Bottimalli - asiakashinta  
    const botPrice = calculateProviderBotCustomerPrice(customSettings);
    
    // Hybridi - asiakashinta
    const hybridPrice = calculateProviderHybridCustomerPrice(selectedMonth, customSettings);
    
    // Säästöt verrattuna ihmisvetoisen malliin
    const savingsBot = humanPrice - botPrice;
    const savingsHybrid = humanPrice - hybridPrice;

    return {
      humanPrice,
      botPrice,
      hybridPrice,
      savingsBot,
      savingsHybrid,
    };
  };

  const costs = calculateCosts();

  const chartData = [
    {
      name: "Ihminen",
      "Asiakashinta": Math.round(costs.humanPrice),
    },
    {
      name: "Botti",
      "Asiakashinta": Math.round(costs.botPrice),
    },
    {
      name: "Hybridi",
      "Asiakashinta": Math.round(costs.hybridPrice),
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
        <h2 className="text-2xl font-bold mb-4">Hintavertailu</h2>
        <p className="text-muted-foreground mb-4">
          Tällä välilehdellä voit vertailla eri mallien asiakashintoja Akvamariinin hinnoittelulla.
          Kaikki hinnat lasketaan Asetukset-välilehden mukaisesti.
        </p>
        <p className="text-muted-foreground">
          Muokkaa kyselymäärää ja hybridimallin kuukautta nähdäksesi, miten hinnat muuttuvat.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Muokattavat arvot</h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="font-medium">Kyselyasetukset</h4>
            <div className="space-y-2">
              <Label>Arvioitu kyselymäärä (kk)</Label>
              <Input
                type="number"
                value={estimatedQueries}
                onChange={(e) => setEstimatedQueries(Number(e.target.value))}
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Hinnat lasketaan Asetukset-välilehden Akvamariinin hinnoittelun mukaan
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Hybridiasetuks</h4>
            <div className="space-y-2">
              <Label>Kuukausi (hybridi)</Label>
              <Input
                type="number"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                min="1"
                max="12"
              />
              <p className="text-xs text-muted-foreground">
                Valitse kuukausi (1-12) hybridimallin botin kehityksen mukaan
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Kustannuserittely</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Malli</TableHead>
              <TableHead className="text-right font-semibold">Asiakashinta</TableHead>
              <TableHead className="text-right font-semibold">Säästö vs. Ihminen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-muted/50">
              <TableCell className="font-semibold">Ihmisvetoinen malli</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(costs.humanPrice)}</TableCell>
              <TableCell className="text-right">-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bottimalli (100% botti)</TableCell>
              <TableCell className="text-right">{formatCurrency(costs.botPrice)}</TableCell>
              <TableCell className="text-right text-primary font-semibold">
                {formatCurrency(costs.savingsBot)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hybridi (kk {selectedMonth})</TableCell>
              <TableCell className="text-right">{formatCurrency(costs.hybridPrice)}</TableCell>
              <TableCell className="text-right text-primary font-semibold">
                {formatCurrency(costs.savingsHybrid)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Visualisointi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
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
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Bar 
              dataKey="Asiakashinta" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="bg-muted/50 p-6 rounded-lg border">
        <h4 className="font-semibold mb-2">Hinnoittelulogiikka:</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Ihmisvetoinen:</strong> Lasketaan Akvamariinin ihmisvetoisen mallin kustannukset + kate
          </p>
          <p>
            <strong>Bottimalli:</strong> Lasketaan Akvamariinin bottikohtaiset kustannukset (ylläpito + järjestelmä) + kate
          </p>
          <p>
            <strong>Hybridi:</strong> Yhdistelmä botti- ja ihmiskustannuksista botin kehitysasteen mukaan (kuukausi 1-12)
          </p>
          <p className="pt-2 border-t">
            <strong>Huomio:</strong> Kaikki hinnat sisältävät Akvamariinin katteen ({settings.providerMarginPercentage}%). 
            Hinnat vaihtelevat kyselymäärien ja portaiden mukaan.
          </p>
        </div>
      </div>
    </div>
  );
}
