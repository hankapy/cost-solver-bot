import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePricing } from "@/contexts/PricingContext";
import { calculateBotCost } from "@/lib/pricingCalculations";
import { Bot, Euro, TrendingUp } from "lucide-react";

export default function BotTab() {
  const { settings } = usePricing();
  const monthlyCalculation = calculateBotCost(settings, false);
  const firstMonthCalculation = calculateBotCost(settings, true);

  const formatCurrency = (value: number) => `${value.toFixed(2)} €`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Botin kustannukset</h2>
        <p className="text-muted-foreground">
          Täysautomaation kustannuslaskenta - botti hoitaa kaikki kyselyt
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Aloitusmaksu veloitetaan vain ensimmäisellä kuukaudella
        </p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Laskentaperuste</CardTitle>
          <CardDescription>
            Miten botin kustannukset lasketaan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <h4 className="font-semibold mb-3">Hinnoittelurakenne:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">1. Ensimmäinen kuukausi:</p>
                <p className="font-mono bg-background p-2 rounded mt-1">
                  Kustannus = Aloitusmaksu (kertaluonteinen)
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Ensimmäisenä kuukautena maksetaan vain kertaluonteinen aloitusmaksu botin käyttöönotosta
                </p>
              </div>
              
              <div>
                <p className="font-semibold">2. Toisesta kuukaudesta eteenpäin:</p>
                <p className="font-mono bg-background p-2 rounded mt-1">
                  Kuukausikustannus = Portaistettu hinta + Järjestelmäkulut
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Portaistettu hinta määräytyy kyselymäärän mukaan (katso asetuksista tiered pricing -taulukko)
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-3">Nykyiset arvot ({monthlyCalculation.monthlyQueries} kyselyä/kk):</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Portaistettu kuukausihinta = {formatCurrency(monthlyCalculation.tieredPrice)}</p>
              <p>Järjestelmäkulut = {formatCurrency(monthlyCalculation.systemCosts)}</p>
              <p className="font-semibold text-foreground pt-2">Kuukausikustannus (kk 2+) = {formatCurrency(monthlyCalculation.totalCost)}</p>
              <p className="text-xs pt-2 italic">Ensimmäisen kuukauden kustannus = {formatCurrency(firstMonthCalculation.totalCost)} (vain aloitusmaksu)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kyselymäärä</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyCalculation.monthlyQueries}</div>
            <p className="text-xs text-muted-foreground">kyselyä / kk</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portaistettu hinta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyCalculation.tieredPrice)}</div>
            <p className="text-xs text-muted-foreground">kuukausiveloitus</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground">Kuukausihinta</CardTitle>
            <Euro className="h-4 w-4 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-foreground">
              {formatCurrency(monthlyCalculation.totalCost)}
            </div>
            <p className="text-xs text-primary-foreground/90">2. kk alkaen</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card border-warning/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">1. kuukausi</CardTitle>
            <Euro className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatCurrency(firstMonthCalculation.totalCost)}
            </div>
            <p className="text-xs text-muted-foreground">sis. aloitusmaksu</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Peruskuukausihinta</CardTitle>
            <CardDescription>Toistuvat kuukausittaiset kulut (2. kk alkaen)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Portaistettu hinta (kuukausiveloitus)</span>
              <span className="font-semibold">{formatCurrency(monthlyCalculation.tieredPrice)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Järjestelmäkulut</span>
              <span className="font-semibold">{formatCurrency(monthlyCalculation.systemCosts)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2">
              <span className="text-lg font-bold flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                Yhteensä
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(monthlyCalculation.totalCost)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-warning/30">
          <CardHeader>
            <CardTitle>Ensimmäinen kuukausi</CardTitle>
            <CardDescription>Vain kertaluonteinen aloitusmaksu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Aloitusmaksu (kertaluonteinen)</span>
              <span className="font-semibold text-warning">{formatCurrency(firstMonthCalculation.startupFee)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2">
              <span className="text-lg font-bold flex items-center gap-2">
                <Euro className="h-5 w-5 text-warning" />
                Yhteensä 1. kk
              </span>
              <span className="text-2xl font-bold text-warning">
                {formatCurrency(firstMonthCalculation.totalCost)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Kuukausiveloitus alkaa toisesta kuukaudesta
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
