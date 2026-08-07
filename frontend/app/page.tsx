import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Features from "@/components/landing/Features";
import Agents from "@/components/landing/Agents";
import Pricing from "@/components/landing/Pricing";
import Flywheel from "@/components/landing/Flywheel";
import Comparison from "@/components/landing/Comparison";
import Freelancers from "@/components/landing/Freelancers";
import FinalCTA from "@/components/landing/FinalCTA";
import FAQ from "@/components/landing/FAQ";
import LandingFooter from "@/components/landing/LandingFooter";
import Reveal from "@/components/ui/Reveal";

// `organic` scopes the landing page to the Organic design system
// (styles/organic.css); the rest of the app keeps the dark token set.
export default function Home() {
  return (
    <main className="organic min-h-screen overflow-x-hidden">
      <LandingNav />
      <Hero />
      <Reveal><Problem /></Reveal>
      <Reveal><Features /></Reveal>
      <Reveal><Agents /></Reveal>
      <Reveal><Pricing /></Reveal>
      <Reveal><Flywheel /></Reveal>
      <Reveal><Comparison /></Reveal>
      <Reveal><Freelancers /></Reveal>
      <Reveal><FinalCTA /></Reveal>
      <Reveal><FAQ /></Reveal>
      <LandingFooter />
    </main>
  );
}
