import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { WhyFails } from "@/components/landing/LogosBar";
import { WhatSynthAdds } from "@/components/landing/Features";
import { AgentNetwork } from "@/components/landing/WhyChoose";
import { AgentExamples } from "@/components/landing/PlatformTiers";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { TerminalFloating } from "@/components/ui/terminal-floating";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#080808" }}>
      <Navbar />
      <Hero />
      <WhyFails />
      <WhatSynthAdds />
      <AgentNetwork />
      <AgentExamples />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <TerminalFloating />
    </main>
  );
}
