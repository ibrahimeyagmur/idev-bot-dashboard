import { useEffect } from "react";
import {
  PanelManifestoHero,
  ModulePillMarquee,
  WhyNoCommands,
  PanelScenarios,
  FinalCTA,
} from "../components/commands";

export function CommandsPage() {
  // Update document title
  useEffect(() => {
    document.title = "IDev — Komut Yok, Panel Var";
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PanelManifestoHero />

      {/* Module Pills Marquee */}
      <ModulePillMarquee />

      {/* Why No Commands Section */}
      <WhyNoCommands />

      {/* Panel Scenarios Section */}
      <PanelScenarios />

      {/* Final CTA Section */}
      <FinalCTA />
    </div>
  );
}
