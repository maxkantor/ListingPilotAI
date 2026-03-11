import React from 'react';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import styles from '../components/landing/LandingSections.module.css';
import { PricingSection } from '../components/landing/PricingSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { ProductDemoSection } from '../components/landing/ProductDemoSection';
import { SampleOutputSection } from '../components/landing/SampleOutputSection';
import { SolutionSection } from '../components/landing/SolutionSection';
import { TrustSection } from '../components/landing/TrustSection';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <HeroSection />
      <ProductDemoSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <TrustSection />
      <SampleOutputSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};
