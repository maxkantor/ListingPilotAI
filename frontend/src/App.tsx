import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { MobileStickyCta } from './components/MobileStickyCta';
import { Navbar } from './components/Navbar';
import { SiteFooter } from './components/SiteFooter';
import { usePageMetadata } from './hooks/usePageMetadata';
import { initializeAnalytics, trackPageView } from './utils/analytics';
import { initializeSeoEnhancements } from './utils/seo';
import { AdminPage } from './pages/AdminPage';
import { AssetsPage } from './pages/AssetsPage';
import { ContactPage } from './pages/ContactPage';
import { CrmPage } from './pages/CrmPage';
import { LandingPage } from './pages/LandingPage';
import { DemoPage } from './pages/DemoPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ListingsPage } from './pages/ListingsPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProductPage } from './pages/ProductPage';
import { PlatformPage } from './pages/PlatformPage';
import { SettingsPage } from './pages/SettingsPage';
import { TermsPage } from './pages/TermsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import './styles/globals.css';

function PublicLayout() {
  const location = useLocation();
  const showStickyMobileCta = location.pathname !== '/privacy' && location.pathname !== '/terms';

  return (
    <>
      <Navbar />
      <Outlet />
      {showStickyMobileCta ? <MobileStickyCta /> : null}
      <SiteFooter />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();

  usePageMetadata(location.pathname);

  React.useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      <Route path="/platform" element={<PlatformPage />} />

      <Route element={<AppShell />}>
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/crm" element={<CrmPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/workspace" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
