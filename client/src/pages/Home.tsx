/**
 * Home — The Genius Index promotional website
 * ELEVATED VERSION: From book landing page to intellectual movement platform
 * Design: Dark Alchemy — obsidian + warm amber gold + cream
 * Fonts: Playfair Display (display) + Lato (body) + Cormorant Garamond (accent)
 */

import AuthorSection from "@/components/AuthorSection";
import BookSection from "@/components/BookSection";
import BuiltFromSection from "@/components/BuiltFromSection";
import DiagramsSection from "@/components/DiagramsSection";
import DomainsSection from "@/components/DomainsSection";
import EcosystemSection from "@/components/EcosystemSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FrameworkSection from "@/components/FrameworkSection";
import GetBookSection from "@/components/GetBookSection";
import HeroSection from "@/components/HeroSection";
import MomentSection from "@/components/MomentSection";
import Navigation from "@/components/Navigation";
import ProblemSection from "@/components/ProblemSection";
import QuoteSection from "@/components/QuoteSection";
import ScrollProgress from "@/components/ScrollProgress";
import WhatYouGetSection from "@/components/WhatYouGetSection";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.10 0.008 285)", color: "oklch(0.92 0.02 80)" }}
    >
      {/* Reading progress indicator */}
      <ScrollProgress />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main>
        {/* 1. Hero — full-bleed, book cover, provocative headline */}
        <HeroSection />

        {/* 2. The Problem — establish thesis before solution */}
        <ProblemSection />

        {/* 3. Interstitial quote */}
        <QuoteSection />

        {/* 4. The Moment — unforgettable grid illumination */}
        <MomentSection />

        {/* 5. About the book — the Four Movements roadmap */}
        <BookSection />

        {/* 6. Nine Domains — interactive Genius Grid */}
        <DomainsSection />

        {/* 7. Built From — intellectual authority */}
        <BuiltFromSection />

        {/* 8. Original Diagrams — visual framework */}
        <DiagramsSection />

        {/* 9. What's inside the book */}
        <WhatYouGetSection />

        {/* 10. Framework — how the Index works, Signature, Braids */}
        <FrameworkSection />

        {/* 11. Author bio */}
        <AuthorSection />

        {/* 12. Ecosystem — the larger platform vision */}
        <EcosystemSection />

        {/* 13. Get the book — purchase CTA */}
        <GetBookSection />

        {/* 14. FAQ */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
