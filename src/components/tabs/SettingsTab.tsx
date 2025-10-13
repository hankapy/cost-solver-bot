import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/contexts/PricingContext";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function SettingsTab() {
  const { settings, updateSettings, resetSettings } = usePricing();

  const handleReset = () => {
    resetSettings();
    toast.success("Asetukset palautettu oletusarvoihin");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Perusasetukset</h2>
          <p className="text-muted-foreground">
            Määritä laskennan perustiedot
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Palauta oletukset
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Kyselymäärät</CardTitle>
            <CardDescription>Määritä kuukausittaiset kyselyt ja käsittelyajat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyQueries">Kyselymäärä / kk</Label>
              <Input
                id="monthlyQueries"
                type="number"
                value={settings.monthlyQueries}
                onChange={(e) => updateSettings({ monthlyQueries: Number(e.target.value) })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minutesPerQuery">Työaika / vastaus (min)</Label>
              <Input
                id="minutesPerQuery"
                type="number"
                value={settings.minutesPerQuery}
                onChange={(e) => updateSettings({ minutesPerQuery: Number(e.target.value) })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="centralizationDiscount">Keskittämisalennus (%)</Label>
              <Input
                id="centralizationDiscount"
                type="number"
                value={settings.centralizationDiscount}
                onChange={(e) => updateSettings({ centralizationDiscount: Number(e.target.value) })}
                min="0"
                max="100"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Botin kiinteät kulut</CardTitle>
            <CardDescription>Määritä botin peruskulut</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="botStartupFee">Aloitusmaksu (€)</Label>
              <Input
                id="botStartupFee"
                type="number"
                value={settings.botStartupFee}
                onChange={(e) => updateSettings({ botStartupFee: Number(e.target.value) })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="botMonthlyFee">Kuukausiveloitus (€)</Label>
              <Input
                id="botMonthlyFee"
                type="number"
                value={settings.botMonthlyFee}
                onChange={(e) => updateSettings({ botMonthlyFee: Number(e.target.value) })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="botSystemCosts">Järjestelmäkulut (€)</Label>
              <Input
                id="botSystemCosts"
                type="number"
                value={settings.botSystemCosts}
                onChange={(e) => updateSettings({ botSystemCosts: Number(e.target.value) })}
                min="0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Botin portaistettu hinnoittelu</CardTitle>
          <CardDescription>Määritä hinnat eri kyselymäärille</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {settings.botTiers.map((tier, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`tier-limit-${index}`}>Kyselyraja</Label>
                  <Input
                    id={`tier-limit-${index}`}
                    type="number"
                    value={tier.queryLimit}
                    onChange={(e) => {
                      const newTiers = [...settings.botTiers];
                      newTiers[index].queryLimit = Number(e.target.value);
                      updateSettings({ botTiers: newTiers });
                    }}
                    min="0"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`tier-price-${index}`}>Hinta (€)</Label>
                  <Input
                    id={`tier-price-${index}`}
                    type="number"
                    value={tier.price}
                    onChange={(e) => {
                      const newTiers = [...settings.botTiers];
                      newTiers[index].price = Number(e.target.value);
                      updateSettings({ botTiers: newTiers });
                    }}
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Botin osuuden kehitys</CardTitle>
          <CardDescription>Määritä kuinka botin osuus kasvaa kuukausittain hybridimallissa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {settings.botGrowth.map((growth, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`growth-${index}`}>Kuukausi {growth.month}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`growth-${index}`}
                    type="number"
                    value={growth.percentage}
                    onChange={(e) => {
                      const newGrowth = [...settings.botGrowth];
                      newGrowth[index].percentage = Number(e.target.value);
                      updateSettings({ botGrowth: newGrowth });
                    }}
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
