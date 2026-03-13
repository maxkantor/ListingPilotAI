import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AdminRoute, ProtectedRoute } from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';
import { AppShell } from './components/AppShell';
import { MobileStickyCta } from './components/MobileStickyCta';
import { Navbar } from './components/Navbar';
import { SiteFooter } from './components/SiteFooter';
import { usePageMetadata } from './hooks/usePageMetadata';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { initializeAnalytics, trackPageView } from './utils/analytics';
import { initializeSeoEnhancements } from './utils/seo';
import { AdminPage } from './pages/AdminPage';
import { AssetsPage } from './pages/AssetsPage';
import { ContactPage } from './pages/ContactPage';
import { CrmPage } from './pages/CrmPage';
import { LandingPage } from './pages/LandingPage';
import { DemoPage } from './pages/DemoPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ListingsPage } from './pages/ListingsPage';
import { LoginPage } from './pages/LoginPage';
import { PackagesPage } from './pages/PackagesPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProductPage } from './pages/ProductPage';
import { PlatformPage } from './pages/PlatformPage';
import { SettingsPage } from './pages/SettingsPage';
import { SignupPage } from './pages/SignupPage';
import { TermsPage } from './pages/TermsPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { WorkspacePage } from './pages/WorkspacePage';
import './styles/globals.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

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
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/platform" element={<PlatformPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/crm" element={<CrmPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AppShell />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
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
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
