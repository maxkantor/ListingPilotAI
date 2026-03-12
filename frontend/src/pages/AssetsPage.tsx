import React from 'react';
import { apiService } from '../services/api';
import type { GeneratedAssetItem, ListingProject } from '../types';
import styles from './AppPages.module.css';

export const AssetsPage: React.FC = () => {
  const [listings, setListings] = React.useState<ListingProject[]>([]);
  const [assets, setAssets] = React.useState<GeneratedAssetItem[]>([]);
  const [selectedListing, setSelectedListing] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      try {
        const listingData = await apiService.getListings();
        setListings(listingData);
        if (listingData[0]) {
          setSelectedListing(listingData[0].id);
          const assetData = await apiService.getListingAssets(listingData[0].id);
          setAssets(assetData);
        }
      } catch {
        // resilient ui
      }
    };

    load();
  }, []);

  const handleChangeListing = async (listingId: string) => {
    setSelectedListing(listingId);
    try {
      const assetData = await apiService.getListingAssets(listingId);
      setAssets(assetData);
    } catch {
      setAssets([]);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div><h2>Assets</h2><p>Review generated assets by listing and manage reusable content.</p></div>
        <div className={styles.actions}>
          <select className={styles.select} value={selectedListing} onChange={(event) => handleChangeListing(event.target.value)}>
            {listings.map((listing) => <option key={listing.id} value={listing.id}>{listing.title}</option>)}
          </select>
        </div>
      </section>

      <section className={styles.grid3}>
        {assets.map((asset) => (
          <article className={styles.item} key={asset.id}>
            <div className={styles.itemTop}><strong>{asset.assetType}</strong><span className={styles.badge}>{asset.isFavorite ? 'Favorite' : 'Saved'}</span></div>
            <p>{asset.title}</p>
            <p>{asset.content}</p>
            <div className={styles.itemMeta}><span>{new Date(asset.updatedAt).toLocaleDateString()}</span><span>Copy · Export</span></div>
          </article>
        ))}
      </section>
    </div>
  );
};
