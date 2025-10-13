import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePricing } from "@/contexts/PricingContext";
import { calculateScenario } from "@/lib/pricingCalculations";
import type { ScenarioComparison } from "@/types/pricing";
import { Plus, Trash2, TrendingUp, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ScenariosTab() {
  const { settings } = usePricing();
  const [scenarios, setScenarios] = useState<ScenarioComparison[]>([
    calculateScenario(100, 30, settings),
    calculateScenario(200, 50, settings),
    calculateScenario(500, 70, settings),
  ]);

  const [newQueries, setNewQueries] = useState(100);
  const [newBotPercentage, setNewBotPercentage] = useState(30);

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;
  const formatPercentage = (value: number) => `${value.toFixed(1)} %`;

  const addScenario = () => {
    const newScenario = calculateScenario(newQueries, newBotPercentage, settings);
    setScenarios([...scenarios, newScenario]);
    toast.success("Skenaario lisätty");
  };

  const removeScenario = (index: number) => {
    setScenarios(scenarios.filter((_, i) => i !== index));
    toast.success("Skenaario poistettu");
  };

  // Datan valmistelu graafille
  const chartData = scenarios.map((scenario, index) => ({
    name: `${scenario.monthlyQueries} kyselyä`,
    skenaario: `Skenaario ${index + 1}`,
    Ihmistyö: Number(scenario.humanCost.toFixed(2)),
    Hybridi: Number(scenario.hybridCost.toFixed(2)),
    Säästö: Number(scenario.savings.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Skenaariot
        </h2>
        <p className="text-muted-foreground">
          Vertaile eri kyselymääriä ja botin osuuksia
        </p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Laskentaperuste</CardTitle>
          <CardDescription>
            Miten skenaariot lasketaan ja vertaillaan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <h4 className="font-semibold mb-3">Skenaariovertailun kaava:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">1. Pelkkä ihmistyö (100% ihminen):</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Ihmiskustannus = ((Kyselyt × Käsittelyaika ÷ 60) × Tuntihinta) + Peruskuukausihinta
                </p>
              </div>
              
              <div>
                <p className="font-semibold">2. Hybridimalli:</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Botin kyselyt = Kokonaiskyselyt × (Botin osuus % ÷ 100)
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Botin kustannus = Portaistettu hinta (botin kyselyiden mukaan) + Järjestelmäkulut
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Ihmisen kyselyt = Kokonaiskyselyt - Botin kyselyt
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Ihmisen osuus = ((Ihmisen kyselyt × Käsittelyaika ÷ 60) × Tuntihinta) + Peruskuukausihinta
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Hybridikustannus = (Botin kustannus + Ihmisen osuus) × (1 - Keskittämisalennus % ÷ 100)
                </p>
              </div>

              <div>
                <p className="font-semibold">3. Säästö:</p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Säästö = Ihmiskustannus - Hybridikustannus
                </p>
                <p className="font-mono bg-background p-2 rounded mt-1 text-xs">
                  Säästöprosentti = (Säästö ÷ Ihmiskustannus) × 100
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Huom:</strong> Tämä vertailu ei sisällä botin aloitusmaksua, koska verrataan jatkuvia kuukausikustannuksia. 
              Aloitusmaksu on kertaluonteinen ensimmäisen kuukauden kustannus.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lisää uusi skenaario</CardTitle>
          <CardDescription>
            Syötä kyselymäärä ja botin osuus vertaillaksesi eri vaihtoehtoja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="newQueries">Kyselymäärä / kk</Label>
              <Input
                id="newQueries"
                type="number"
                value={newQueries}
                onChange={(e) => setNewQueries(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="newBotPercentage">Botin osuus (%)</Label>
              <Input
                id="newBotPercentage"
                type="number"
                value={newBotPercentage}
                onChange={(e) => setNewBotPercentage(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            <Button onClick={addScenario} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Lisää skenaario
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Skenaariovertailu</CardTitle>
          <CardDescription>
            Kustannusvertailu eri tilanteissa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kyselyt/kk</TableHead>
                  <TableHead>Botti %</TableHead>
                  <TableHead>Ihminen</TableHead>
                  <TableHead>Botti</TableHead>
                  <TableHead>Hybridi</TableHead>
                  <TableHead className="text-success font-semibold">Säästö</TableHead>
                  <TableHead className="text-success font-semibold">Säästö %</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios.map((scenario, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{scenario.monthlyQueries}</TableCell>
                    <TableCell>{formatPercentage(scenario.botPercentage)}</TableCell>
                    <TableCell className="text-destructive">
                      {formatCurrency(scenario.humanCost)}
                    </TableCell>
                    <TableCell className="text-primary">
                      {formatCurrency(scenario.botCost)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(scenario.hybridCost)}
                    </TableCell>
                    <TableCell className="font-bold text-success">
                      {formatCurrency(scenario.savings)}
                    </TableCell>
                    <TableCell className="font-bold text-success">
                      {formatPercentage(scenario.savingsPercentage)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScenario(index)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {scenarios.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ei skenaarioita. Lisää ensimmäinen skenaario yllä olevalla lomakkeella.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {scenarios.length > 0 && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Visuaalinen vertailu
            </CardTitle>
            <CardDescription>
              Graafinen esitys kustannuksista eri skenaarioissa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
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
                  dataKey="Ihmistyö" 
                  fill="hsl(var(--destructive))" 
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="Hybridi" 
                  fill="hsl(var(--primary))" 
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="Säästö" 
                  fill="hsl(var(--success))" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {scenarios.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <Card key={index} className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-sm">
                  Skenaario {index + 1}: {scenario.monthlyQueries} kyselyä
                </CardTitle>
                <CardDescription>Botin osuus: {formatPercentage(scenario.botPercentage)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ihminen:</span>
                  <span className="font-semibold text-destructive">
                    {formatCurrency(scenario.humanCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hybridi:</span>
                  <span className="font-semibold">
                    {formatCurrency(scenario.hybridCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="font-semibold text-success">Säästö:</span>
                  <span className="font-bold text-success">
                    {formatCurrency(scenario.savings)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
