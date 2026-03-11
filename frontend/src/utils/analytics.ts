declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
const hotjarId = import.meta.env.VITE_HOTJAR_ID;
const hotjarVersion = import.meta.env.VITE_HOTJAR_VERSION || '6';
let initialized = false;

function initializeClarity() {
  if (!clarityProjectId || typeof document === 'undefined' || document.getElementById('clarity-script')) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'clarity-script';
  script.type = 'text/javascript';
  script.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityProjectId}");`;
  document.head.appendChild(script);
}

function initializeHotjar() {
  if (!hotjarId || typeof document === 'undefined' || document.getElementById('hotjar-script')) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'hotjar-script';
  script.type = 'text/javascript';
  script.innerHTML = `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hotjarId},hjsv:${hotjarVersion}};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (initialized || typeof document === 'undefined') {
    initializeClarity();
    initializeHotjar();
    return;
  }

  initialized = true;

  if (!measurementId) {
    initializeClarity();
    initializeHotjar();
    return;
  }

  const existing = document.getElementById('ga4-script');
  if (!existing) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
  initializeClarity();
  initializeHotjar();
}

export function trackPageView(path: string) {
  if (!measurementId || !window.gtag) {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (!measurementId || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, params ?? {});
}

export function trackCta(label: string, destination: string) {
  trackEvent('cta_click', {
    cta_label: label,
    destination,
    page_path: window.location.pathname,
  });
}
