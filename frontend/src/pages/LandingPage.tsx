import React from 'react';
import { Footer } from '../components/landing/Footer';
import { HeroProductSection } from '../components/landing/HeroProductSection';
import styles from '../components/landing/LandingV2.module.css';
import { PricingSection } from '../components/landing/PricingSection';
import { ProductFlowSection } from '../components/landing/ProductFlowSection';
import { ProofSection } from '../components/landing/ProofSection';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <HeroProductSection />
      <ProductFlowSection />
      <ProofSection />
      <PricingSection />
      <Footer />
    </div>
  );
};
