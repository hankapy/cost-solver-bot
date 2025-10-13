import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Bot, GitMerge, PiggyBank, TrendingUp } from "lucide-react";
import SettingsTab from "./tabs/SettingsTab";
import HumanTab from "./tabs/HumanTab";
import BotTab from "./tabs/BotTab";
import HybridTab from "./tabs/HybridTab";
import SavingsTab from "./tabs/SavingsTab";
import ScenariosTab from "./tabs/ScenariosTab";

export default function PricingLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-gradient-primary shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary-foreground">
            Hinnoittelutyökalu
          </h1>
          <p className="text-primary-foreground/90 mt-1">
            Asiakaspalvelun dynaaminen kustannuslaskuri
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8 h-auto">
            <TabsTrigger value="settings" className="flex items-center gap-2 py-3">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Asetukset</span>
            </TabsTrigger>
            <TabsTrigger value="human" className="flex items-center gap-2 py-3">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Ihminen</span>
            </TabsTrigger>
            <TabsTrigger value="bot" className="flex items-center gap-2 py-3">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Botti</span>
            </TabsTrigger>
            <TabsTrigger value="hybrid" className="flex items-center gap-2 py-3">
              <GitMerge className="h-4 w-4" />
              <span className="hidden sm:inline">Yhdistelmä</span>
            </TabsTrigger>
            <TabsTrigger value="savings" className="flex items-center gap-2 py-3">
              <PiggyBank className="h-4 w-4" />
              <span className="hidden sm:inline">Säästöt</span>
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2 py-3">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Skenaariot</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          
          <TabsContent value="human">
            <HumanTab />
          </TabsContent>
          
          <TabsContent value="bot">
            <BotTab />
          </TabsContent>
          
          <TabsContent value="hybrid">
            <HybridTab />
          </TabsContent>
          
          <TabsContent value="savings">
            <SavingsTab />
          </TabsContent>
          
          <TabsContent value="scenarios">
            <ScenariosTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
