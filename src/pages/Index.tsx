import { PricingProvider } from "@/contexts/PricingContext";
import PricingLayout from "@/components/PricingLayout";

const Index = () => {
  return (
    <PricingProvider>
      <PricingLayout />
    </PricingProvider>
  );
};

export default Index;
