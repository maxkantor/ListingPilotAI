import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MobileStickyCta } from './components/MobileStickyCta';
import { Navbar } from './components/Navbar';
import { SiteFooter } from './components/SiteFooter';
import { usePageMetadata } from './hooks/usePageMetadata';
import { initializeAnalytics, trackPageView } from './utils/analytics';
import { initializeSeoEnhancements } from './utils/seo';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { LandingPage } from './pages/LandingPage';
import { DemoPage } from './pages/DemoPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProductPage } from './pages/ProductPage';
import { TermsPage } from './pages/TermsPage';
import { DashboardPage } from './pages/DashboardPage';
import './styles/globals.css';

function AppRoutes() {
  const location = useLocation();
  const isAppRoute = location.pathname === '/dashboard' || location.pathname === '/admin';
  const showStickyMobileCta = !isAppRoute && location.pathname !== '/privacy' && location.pathname !== '/terms';

  usePageMetadata(location.pathname);

  React.useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {showStickyMobileCta ? <MobileStickyCta /> : null}
      {!isAppRoute ? <SiteFooter /> : null}
    </>
  );
}

function App() {
  React.useEffect(() => {
    initializeAnalytics();
    initializeSeoEnhancements();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
