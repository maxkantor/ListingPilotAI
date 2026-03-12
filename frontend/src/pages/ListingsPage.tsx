import React from 'react';
import { apiService } from '../services/api';
import type { ListingProject } from '../types';
import styles from './AppPages.module.css';

export const ListingsPage: React.FC = () => {
  const [listings, setListings] = React.useState<ListingProject[]>([]);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getListings();
        setListings(data);
      } catch {
        // keep page resilient
      }
    };

    load();
  }, []);

  const filtered = listings.filter((item) => [item.title, item.streetAddress, item.city, item.state, item.status].join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div><h2>Listings</h2><p>Track listing status, tone, channels, and launch readiness.</p></div>
        <div className={styles.actions}><input className={styles.input} placeholder="Search listings" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      </section>

      <section className={styles.panel}>
        <div className={styles.tableHead}><strong>Listing</strong><strong>Status</strong><strong>Price</strong><strong>Tone</strong></div>
        {filtered.map((listing) => (
          <div className={styles.tableRow} key={listing.id}>
            <span>{listing.title} · {listing.city}, {listing.state}</span>
            <span className={styles.badge}>{listing.status}</span>
            <span>{listing.price}</span>
            <span>{listing.tone}</span>
          </div>
        ))}
      </section>

      <section className={styles.grid3}>
        {filtered.slice(0, 6).map((listing) => (
          <article className={styles.item} key={`${listing.id}-card`}>
            <div className={styles.itemTop}><strong>{listing.title}</strong><span className={styles.badge}>{listing.status}</span></div>
            <p>{listing.streetAddress}</p>
            <div className={styles.itemMeta}><span>{listing.price}</span><span>{listing.channels.join(' · ')}</span></div>
          </article>
        ))}
      </section>
    </div>
  );
};
