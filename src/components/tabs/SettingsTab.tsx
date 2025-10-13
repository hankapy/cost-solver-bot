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
          <div className="space-y-3">
            {settings.botTiers.map((tier, index) => (
              <div key={index} className="flex gap-3 items-end">
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
          <CardDescription>Määritä kuinka botin osuus kasvaa kuukausittain ja vuosittain hybridimallissa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3 text-sm">Kuukausitaso (1-12 kk)</h4>
            <div className="space-y-2">
              {settings.botGrowth.map((growth, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Label htmlFor={`growth-${index}`} className="w-24 text-sm">Kuukausi {growth.month}</Label>
                  <div className="flex items-center gap-2 flex-1 max-w-xs">
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
                    <span className="text-sm text-muted-foreground min-w-[20px]">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-3 text-sm">Vuositaso (0-3 vuotta)</h4>
            <div className="space-y-2">
              {settings.botYearlyGrowth.map((growth, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Label htmlFor={`yearly-growth-${index}`} className="w-24 text-sm">
                    {growth.year === 0 ? "Vuosi 0 (kk 1-12)" : `Vuosi ${growth.year}`}
                  </Label>
                  <div className="flex items-center gap-2 flex-1 max-w-xs">
                    <Input
                      id={`yearly-growth-${index}`}
                      type="number"
                      value={growth.percentage}
                      onChange={(e) => {
                        const newGrowth = [...settings.botYearlyGrowth];
                        newGrowth[index].percentage = Number(e.target.value);
                        updateSettings({ botYearlyGrowth: newGrowth });
                      }}
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-muted-foreground min-w-[20px]">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Huom:</strong> Kuukausitaso kuvaa kehitystä ensimmäisen vuoden aikana. 
              Vuositaso määrittää botin osuuden pidemmällä aikavälillä (vuosina 0-3).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
