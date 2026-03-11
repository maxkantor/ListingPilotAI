const SITE_URL = 'https://listingpilotai.com';

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  path: string;
}

const defaultMeta: PageMeta = {
  title: 'ListingPilot AI | Premium AI marketing for real estate agents',
  description:
    'ListingPilot AI helps real estate agents turn listing data into launch-ready MLS copy, social campaigns, email sequences, and conversion insights.',
  keywords:
    'real estate AI, listing marketing software, MLS description generator, real estate CRM, agent marketing automation',
  path: '/',
};

const pageMetaMap: Record<string, PageMeta> = {
  '/': defaultMeta,
  '/product': {
    title: 'Product | ListingPilot AI',
    description:
      'See the full ListingPilot AI operating system for listing launches, campaign workflows, agent collaboration, and CRM-ready follow-up.',
    keywords: 'real estate marketing platform, listing workflow software, agent collaboration',
    path: '/product',
  },
  '/pricing': {
    title: 'Pricing | ListingPilot AI',
    description:
      'Compare ListingPilot AI plans for solo agents, top producers, and brokerages ready to scale listing marketing with AI.',
    keywords: 'listingpilot pricing, real estate ai pricing, brokerage marketing software cost',
    path: '/pricing',
  },
  '/demo': {
    title: 'Demo | ListingPilot AI',
    description:
      'Preview ListingPilot AI outputs, campaign workflows, and the premium experience agents use to launch listings faster.',
    keywords: 'listingpilot demo, real estate ai demo, listing marketing examples',
    path: '/demo',
  },
  '/contact': {
    title: 'Contact | ListingPilot AI',
    description:
      'Book a demo, request enterprise onboarding, or talk to the ListingPilot AI team about scaling agent performance.',
    keywords: 'contact listingpilot, real estate saas demo, brokerage onboarding',
    path: '/contact',
  },
  '/dashboard': {
    title: 'Workspace | ListingPilot AI',
    description:
      'Manage listing launches, AI-generated assets, and campaign performance from the ListingPilot AI workspace.',
    keywords: 'listing workspace, marketing dashboard, real estate campaign performance',
    path: '/dashboard',
  },
  '/admin': {
    title: 'Admin | ListingPilot AI',
    description:
      'Review pipeline health, agent accounts, support load, and growth analytics from the ListingPilot AI admin portal.',
    keywords: 'saas admin portal, crm admin dashboard, real estate team analytics',
    path: '/admin',
  },
  '/privacy': {
    title: 'Privacy Policy | ListingPilot AI',
    description: 'Read how ListingPilot AI handles user data, analytics, and platform security.',
    keywords: 'privacy policy, data handling, analytics disclosure',
    path: '/privacy',
  },
  '/terms': {
    title: 'Terms of Service | ListingPilot AI',
    description: 'Read the ListingPilot AI terms covering platform access, acceptable use, and service expectations.',
    keywords: 'terms of service, acceptable use, saas agreement',
    path: '/terms',
  },
};

function setMeta(attribute: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonical(path: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', `${SITE_URL}${path}`);
}

function setStructuredData(meta: PageMeta) {
  const scriptId = 'listingpilot-schema';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ListingPilot AI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: meta.description,
    url: `${SITE_URL}${meta.path}`,
    offers: {
      '@type': 'Offer',
      price: '79',
      priceCurrency: 'USD',
    },
  });
}

export function applyPageMetadata(pathname: string) {
  const meta = pageMetaMap[pathname] ?? defaultMeta;

  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('name', 'keywords', meta.keywords);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', `${SITE_URL}${meta.path}`);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setCanonical(meta.path);
  setStructuredData(meta);
}
