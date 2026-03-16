import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useGenerator } from '../hooks/useGenerator';
import { apiService } from '../services/api';
import type { GeneratedOutput, PropertyInput } from '../types';
import { STATE_ABBREVIATIONS } from '../utils/constants';
import styles from './WorkspacePage.module.css';

type AssetKey = keyof GeneratedOutput;

const generationSteps: Array<{ key: AssetKey; label: string }> = [
  { key: 'mlsDescription', label: 'MLS description' },
  { key: 'luxuryDescription', label: 'Luxury description' },
  { key: 'facebookPost', label: 'Facebook post' },
  { key: 'instagramCaption', label: 'Instagram caption' },
  { key: 'linkedInPost', label: 'LinkedIn post' },
  { key: 'emailBlurb', label: 'Email campaign' },
];

const assetTabs: Array<{ key: AssetKey; label: string; exportName: string }> = [
  { key: 'mlsDescription', label: 'MLS', exportName: 'mls-description' },
  { key: 'luxuryDescription', label: 'Luxury', exportName: 'luxury-description' },
  { key: 'instagramCaption', label: 'Instagram', exportName: 'instagram-caption' },
  { key: 'facebookPost', label: 'Facebook', exportName: 'facebook-post' },
  { key: 'linkedInPost', label: 'LinkedIn', exportName: 'linkedin-post' },
  { key: 'emailBlurb', label: 'Email', exportName: 'email-campaign' },
];

const emptyOutput: GeneratedOutput = {
  mlsDescription: '',
  luxuryDescription: '',
  facebookPost: '',
  instagramCaption: '',
  linkedInPost: '',
  emailBlurb: '',
};

const STREET_SUFFIXES = new Set([
  'aly', 'allee', 'alley', 'ave', 'avenue', 'blvd', 'boulevard', 'cir', 'circle', 'court', 'ct', 'dr', 'drive', 'hwy',
  'highway', 'ln', 'lane', 'loop', 'pkwy', 'parkway', 'pl', 'place', 'rd', 'road', 'sq', 'street', 'st', 'ter', 'terrace',
  'trl', 'trail', 'way', 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw',
]);

const DIRECTIONALS = new Set(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']);
const US_STATES = new Set(STATE_ABBREVIATIONS.map((state) => state.toUpperCase()));

const toTitleCaseToken = (token: string) => {
  const lowered = token.toLowerCase();

  if (DIRECTIONALS.has(lowered)) {
    return lowered.toUpperCase();
  }

  if (/^\d/.test(token)) {
    return token;
  }

  return lowered.charAt(0).toUpperCase() + lowered.slice(1);
};

const toTitleCase = (value: string) => value
  .split(/\s+/)
  .filter(Boolean)
  .map(toTitleCaseToken)
  .join(' ');

const formatWithCommas = (value: string) => {
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) {
    return value;
  }

  const numeric = Number(digits);
  if (!Number.isFinite(numeric)) {
    return value;
  }

  return numeric.toLocaleString();
};

const formatMillions = (value: string) => {
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return value;
  }

  if (numeric >= 1_000_000) {
    const millions = numeric / 1_000_000;
    const compact = millions >= 10 ? millions.toFixed(0) : millions.toFixed(1);
    return `$${compact}MM`;
  }

  return `$${numeric.toLocaleString()}`;
};

const parseListingUrl = (rawUrl: string): Partial<PropertyInput> => {
  try {
    const parsed = new URL(rawUrl.trim());
    const pathname = decodeURIComponent(parsed.pathname || '').replace(/\/+$/, '');
    const pathSegments = pathname.split('/').filter(Boolean);
    const detailIndex = pathSegments.findIndex((segment) => segment.toLowerCase() === 'homedetails');
    const slugCandidate = detailIndex >= 0 ? pathSegments[detailIndex + 1] : pathSegments[pathSegments.length - 1];

    if (!slugCandidate) {
      return {};
    }

    const cleanedSlug = slugCandidate
      .replace(/_zpid.*/i, '')
      .replace(/-\d{7,}$/i, '')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .trim();

    const tokens = cleanedSlug
      .split('-')
      .filter(Boolean)
      .map((token) => token.trim());

    if (!tokens.length) {
      return {};
    }

    const zipIndex = tokens.findIndex((token) => /^\d{5}(?:\d{4})?$/.test(token));

    let stateIndex = -1;
    for (let index = (zipIndex > 0 ? zipIndex - 1 : tokens.length - 1); index >= 0; index -= 1) {
      const candidate = tokens[index].toUpperCase();
      if (US_STATES.has(candidate)) {
        stateIndex = index;
        break;
      }
    }

    let streetAddress = '';
    let city = '';
    let stateCode = '';
    let zipCode = '';

    if (zipIndex >= 0) {
      zipCode = tokens[zipIndex];
    }

    if (stateIndex >= 0) {
      stateCode = tokens[stateIndex].toUpperCase();
      const streetAndCity = tokens.slice(0, stateIndex);
      let streetEndIndex = -1;
      for (let index = streetAndCity.length - 1; index >= 0; index -= 1) {
        if (STREET_SUFFIXES.has(streetAndCity[index].toLowerCase())) {
          streetEndIndex = index;
          break;
        }
      }

      if (streetEndIndex >= 0) {
        const nextToken = streetAndCity[streetEndIndex + 1]?.toLowerCase() ?? '';
        const includeDirectional = DIRECTIONALS.has(nextToken);
        const streetEnd = includeDirectional ? streetEndIndex + 1 : streetEndIndex;

        streetAddress = toTitleCase(streetAndCity.slice(0, streetEnd + 1).join(' '));
        city = toTitleCase(streetAndCity.slice(streetEndIndex + 1).join(' '));

        if (includeDirectional) {
          city = toTitleCase(streetAndCity.slice(streetEnd + 1).join(' '));
        }
      } else {
        streetAddress = toTitleCase(streetAndCity.join(' '));
      }
    }

    const bedsMatch = cleanedSlug.match(/(\d+(?:\.\d+)?)\s*-?beds?/i);
    const bathsMatch = cleanedSlug.match(/(\d+(?:\.\d+)?)\s*-?baths?/i);
    const sqftMatch = cleanedSlug.match(/(\d[\d,]*)\s*-?(?:sqft|sq-ft|square-feet|sqfeet)/i);

    const parsedFields: Partial<PropertyInput> = {
      streetAddress: streetAddress || undefined,
      city: city || undefined,
      state: stateCode || undefined,
      zip: zipCode || undefined,
      beds: bedsMatch?.[1],
      baths: bathsMatch?.[1],
      squareFeet: sqftMatch?.[1],
    };

    return Object.fromEntries(
      Object.entries(parsedFields).filter(([, value]) => Boolean(value)),
    ) as Partial<PropertyInput>;
  } catch {
    return {};
  }
};

export const WorkspacePage: React.FC = () => {
  const { session } = useAuth();
  const { output, usage, isLoading, error, generate, reset } = useGenerator();
  const [inputMode, setInputMode] = React.useState<'url' | 'manual'>('url');
  const [listingUrl, setListingUrl] = React.useState('');
  const [streetAddress, setStreetAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [zip, setZip] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [beds, setBeds] = React.useState('');
  const [baths, setBaths] = React.useState('');
  const [squareFeet, setSquareFeet] = React.useState('');
  const [keyFeatures, setKeyFeatures] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<AssetKey>('mlsDescription');
  const [assets, setAssets] = React.useState<GeneratedOutput>(emptyOutput);
  const [favoriteKeys, setFavoriteKeys] = React.useState<Set<AssetKey>>(new Set());
  const [showSummaryCard, setShowSummaryCard] = React.useState(false);
  const [notice, setNotice] = React.useState('');
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);

  const displayPrice = React.useMemo(() => formatMillions(price), [price]);

  React.useEffect(() => {
    if (output) {
      setAssets(output);
      setShowSummaryCard(true);
    }
  }, [output]);

  React.useEffect(() => {
    if (!isLoading) {
      setActiveStepIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveStepIndex((previous) => (previous + 1) % generationSteps.length);
    }, 750);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  const listingSummary = {
    address: streetAddress || 'Address pending',
    price: displayPrice || 'Price pending',
    bedsBaths: `${beds || '—'} beds / ${baths || '—'} baths`,
    location: [city, state].filter(Boolean).join(', ') || 'Location pending',
  };

  const createPropertyPayload = (): PropertyInput => ({
    listingUrl,
    streetAddress: streetAddress || 'Imported from listing URL',
    city: city || 'Atlanta',
    state: state || 'GA',
    zip: zip || '30305',
    price: price || '$10,000,000',
    beds: beds || '4',
    baths: baths || '3',
    squareFeet: squareFeet || '3200',
    lotSize: '',
    propertyType: 'Single Family',
    yearBuilt: '',
    neighborhood: '',
    keyFeatures: keyFeatures || 'Natural light, premium finishes, move-in ready condition',
    interiorFeatures: '',
    exteriorFeatures: '',
    schoolInfo: '',
    agentNotes: inputMode === 'url' ? `Source URL: ${listingUrl || 'not-provided'}` : 'Manual listing setup',
    targetBuyerType: 'Move-up buyers',
    tone: 'Luxury',
  });

  const handleGenerate = async () => {
    reset();
    setNotice('');
    await generate(createPropertyPayload(), 'workspace');
    setShowSummaryCard(true);
  };

  const handleListingUrlBlur = async () => {
    const trimmed = listingUrl.trim();
    if (!trimmed) {
      return;
    }

    const autoFilled: string[] = [];

    try {
      const preview = await apiService.getListingPreview(trimmed);

      if (!streetAddress && preview.streetAddress) {
        setStreetAddress(preview.streetAddress);
        autoFilled.push('Address');
      }

      if (!city && preview.city) {
        setCity(city ? city : preview.city);
        autoFilled.push('City');
      }

      if (!state && preview.state) {
        setState(preview.state);
        autoFilled.push('State');
      }

      if (!zip && preview.zip) {
        setZip(preview.zip);
        autoFilled.push('ZIP');
      }

      if (!price && preview.price) {
        setPrice(formatWithCommas(preview.price));
        autoFilled.push('Price');
      }

      if (!beds && preview.beds) {
        setBeds(preview.beds);
        autoFilled.push('Beds');
      }

      if (!baths && preview.baths) {
        setBaths(preview.baths);
        autoFilled.push('Baths');
      }

      if (!squareFeet && preview.squareFeet) {
        setSquareFeet(formatWithCommas(preview.squareFeet));
        autoFilled.push('Square feet');
      }
    } catch {
      // graceful fallback to URL parsing only
    }

    const parsed = parseListingUrl(trimmed);

    if (!streetAddress && parsed.streetAddress) {
      setStreetAddress(parsed.streetAddress);
      autoFilled.push('Address');
    }

    if (!city && parsed.city) {
      setCity(parsed.city);
      autoFilled.push('City');
    }

    if (!state && parsed.state) {
      setState(parsed.state);
      autoFilled.push('State');
    }

    if (!zip && parsed.zip) {
      setZip(parsed.zip);
      autoFilled.push('ZIP');
    }

    if (!beds && parsed.beds) {
      setBeds(parsed.beds);
      autoFilled.push('Beds');
    }

    if (!baths && parsed.baths) {
      setBaths(parsed.baths);
      autoFilled.push('Baths');
    }

    if (!squareFeet && parsed.squareFeet) {
      setSquareFeet(parsed.squareFeet);
      if (!autoFilled.includes('Square feet')) {
        autoFilled.push('Square feet');
      }
    }

    if (autoFilled.length) {
      setNotice(`Auto-filled from listing URL: ${autoFilled.join(', ')}.`);
    } else {
      setNotice('Listing URL parsed. No new fields were available to auto-fill.');
    }
  };

  const updateActiveAsset = (value: string) => {
    setAssets((previous) => ({ ...previous, [activeTab]: value }));
  };

  const copyActiveAsset = async () => {
    await navigator.clipboard.writeText(assets[activeTab] || '');
    setNotice(`${assetTabs.find((tab) => tab.key === activeTab)?.label ?? 'Asset'} copied to clipboard.`);
  };

  const copyAllAssets = async () => {
    const content = assetTabs
      .map((tab) => `${tab.label}\n\n${assets[tab.key] || ''}`)
      .join('\n\n------------------------------\n\n');
    await navigator.clipboard.writeText(content);
    setNotice('All assets copied.');
  };

  const downloadText = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportActiveAsset = () => {
    const tab = assetTabs.find((item) => item.key === activeTab);
    if (!tab) {
      return;
    }

    downloadText(`${tab.exportName}.txt`, assets[tab.key] || '');
  };

  const exportZip = async () => {
    const jsZip = await import('jszip');
    const zipArchive = new jsZip.default();

    assetTabs.forEach((tab) => {
      zipArchive.file(`${tab.exportName}.txt`, assets[tab.key] || '');
    });

    const blob = await zipArchive.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `listing-launch-assets-${Date.now()}.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const downloadPackage = () => {
    const packageJson = JSON.stringify(
      {
        listingSummary,
        generatedAt: new Date().toISOString(),
        assets,
      },
      null,
      2,
    );
    downloadText(`listing-launch-package-${Date.now()}.json`, packageJson);
  };

  const sendToCrm = async () => {
    await apiService.trackEvent({
      eventType: 'workspace.send_to_crm_clicked',
      path: '/workspace',
      source: 'workspace',
      metadata: {
        address: listingSummary.address,
      },
    });
    setNotice('Assets queued for CRM handoff.');
  };

  const toggleFavorite = () => {
    setFavoriteKeys((previous) => {
      const next = new Set(previous);
      if (next.has(activeTab)) {
        next.delete(activeTab);
      } else {
        next.add(activeTab);
      }
      return next;
    });
  };

  const getStepState = (index: number): 'done' | 'active' | 'pending' => {
    if (output && !isLoading) {
      return 'done';
    }
    if (isLoading && index < activeStepIndex) {
      return 'done';
    }
    if (isLoading && index === activeStepIndex) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <section className={styles.studio} id="new-listing">
      <header className={styles.studioHeader}>
        <div>
          <p className={styles.kicker}>Listing Launch Studio</p>
          <h2>Guided listing launch workflow</h2>
          <p>Set up the listing, generate premium marketing assets, then export or publish in one focused flow.</p>
        </div>
        <div className={styles.headerStats}>
          <span>{usage?.creditBalance ?? session?.currentUser?.creditBalance ?? 0} credits remaining</span>
          <span>{session?.currentUser?.planCode ?? 'Starter'} plan</span>
        </div>
      </header>

      <div className={styles.workflowGrid}>
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <p>Step 1</p>
            <h3>Listing setup</h3>
          </div>

          <div className={styles.modeSwitch}>
            <button type="button" className={inputMode === 'url' ? styles.modeActive : ''} onClick={() => setInputMode('url')}>Listing URL</button>
            <button type="button" className={inputMode === 'manual' ? styles.modeActive : ''} onClick={() => setInputMode('manual')}>Manual entry</button>
          </div>

          {inputMode === 'url' ? (
            <div className={styles.fieldGroup}>
              <label>Listing URL</label>
              <input
                value={listingUrl}
                onChange={(event) => setListingUrl(event.target.value)}
                onBlur={handleListingUrlBlur}
                placeholder="https://www.zillow.com/homedetails/..."
                autoComplete="off"
              />
            </div>
          ) : null}

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label>Address</label>
              <input value={streetAddress} onChange={(event) => setStreetAddress(event.target.value)} placeholder="4812 Wieuca Road NE" autoComplete="off" />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label>City</label>
                <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Atlanta" autoComplete="off" />
              </div>
              <div className={styles.fieldGroup}>
                <label>State</label>
                <input value={state} onChange={(event) => setState(event.target.value)} placeholder="GA" autoComplete="off" />
              </div>
              <div className={styles.fieldGroup}>
                <label>ZIP</label>
                <input value={zip} onChange={(event) => setZip(event.target.value)} placeholder="30305" autoComplete="off" />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label>Price</label>
                <input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="$10,000,000" autoComplete="off" />
              </div>
              <div className={styles.fieldGroup}>
                <label>Beds</label>
                <input value={beds} onChange={(event) => setBeds(event.target.value)} placeholder="4" autoComplete="off" />
              </div>
              <div className={styles.fieldGroup}>
                <label>Baths</label>
                <input value={baths} onChange={(event) => setBaths(event.target.value)} placeholder="3" autoComplete="off" />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label>Square feet</label>
              <input value={squareFeet} onChange={(event) => setSquareFeet(event.target.value)} placeholder="3,200" autoComplete="off" />
            </div>
            <div className={styles.fieldGroup}>
              <label>Key features</label>
              <textarea
                value={keyFeatures}
                onChange={(event) => setKeyFeatures(event.target.value)}
                placeholder="Chef kitchen, heated pool, new roof, walkable to top schools"
              />
            </div>
          </div>

          {showSummaryCard ? (
            <div className={styles.summaryCard}>
              <strong>Listing summary</strong>
              <p>{listingSummary.address}</p>
              <div>
                <span>{listingSummary.price}</span>
                <span>{listingSummary.bedsBaths}</span>
                <span>{listingSummary.location}</span>
              </div>
            </div>
          ) : null}

          <button type="button" className={styles.primaryAction} onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating assets…' : 'Generate Assets'}
          </button>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <p>Step 2</p>
            <h3>Generate marketing assets</h3>
          </div>

          <div className={styles.stepList}>
            {generationSteps.map((step, index) => {
              const stateForStep = getStepState(index);
              return (
                <div key={step.key} className={styles.stepRow}>
                  <span className={`${styles.stepIndicator} ${styles[`step${stateForStep[0].toUpperCase()}${stateForStep.slice(1)}`]}`} />
                  <div>
                    <strong>{step.label}</strong>
                    <span>
                      {stateForStep === 'done'
                        ? 'Completed'
                        : stateForStep === 'active'
                          ? 'Generating…'
                          : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.progressBlock}>
            <p>Workflow progress</p>
            <div className={styles.progressTrack}>
              <span
                style={{
                  width: `${output ? 100 : isLoading ? ((activeStepIndex + 1) / generationSteps.length) * 100 : 8}%`,
                }}
              />
            </div>
          </div>

          {error ? <div className={styles.errorMessage}>{error}</div> : null}
          {notice ? <div className={styles.notice}>{notice}</div> : null}
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <p>Step 3</p>
            <h3>Export / publish</h3>
          </div>

          <div className={styles.tabBar}>
            {assetTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={activeTab === tab.key ? styles.tabActive : ''}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.editorWrap}>
            <textarea
              value={assets[activeTab] || ''}
              onChange={(event) => updateActiveAsset(event.target.value)}
              placeholder="Generated marketing asset will appear here."
            />
          </div>

          <div className={styles.inlineActions}>
            <button type="button" onClick={copyActiveAsset}>Copy</button>
            <button type="button" onClick={toggleFavorite}>{favoriteKeys.has(activeTab) ? 'Unfavorite' : 'Favorite'}</button>
            <button type="button" onClick={exportActiveAsset}>Export</button>
          </div>
        </article>
      </div>

      <div className={styles.bottomActionBar} id="history">
        <button type="button" onClick={exportZip}>Export ZIP</button>
        <button type="button" onClick={copyAllAssets}>Copy all assets</button>
        <button type="button" onClick={sendToCrm}>Send to CRM</button>
        <button type="button" onClick={downloadPackage}>Download package</button>
      </div>
    </section>
  );
};
