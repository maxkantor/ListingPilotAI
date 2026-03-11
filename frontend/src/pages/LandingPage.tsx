import React from 'react';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { ComplianceSection } from '../components/landing/ComplianceSection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import styles from '../components/landing/LandingSections.module.css';
import { PricingSection } from '../components/landing/PricingSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { ProductWalkthrough } from '../components/landing/ProductWalkthrough';
import { SampleOutputSection } from '../components/landing/SampleOutputSection';
import { SolutionSection } from '../components/landing/SolutionSection';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <HeroSection />
      <ProductWalkthrough />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <ComplianceSection />
      <SampleOutputSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};
