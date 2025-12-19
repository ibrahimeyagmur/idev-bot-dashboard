import { useEffect } from "react";
import {
  PanelManifestoHero,
  ModulePillMarquee,
  WhyNoCommands,
  PanelScenarios,
  FinalCTA,
} from "../components/commands";

export function CommandsPage() {
  useEffect(() => {
    document.title = "IDev — Komut Yok, Panel Var";
  }, []);

  return (
    <div className="min-h-screen">
      <PanelManifestoHero />

      <ModulePillMarquee />

      <WhyNoCommands />

      <PanelScenarios />

      <FinalCTA />
    </div>
  );
}
