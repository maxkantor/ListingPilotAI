import React, { useState } from 'react';
import type { PropertyInput, PropertyType, ToneType } from '../types';
import { Button } from './Button';
import { SAMPLE_PROPERTY, STATE_ABBREVIATIONS, PROPERTY_TYPES, TONE_OPTIONS } from '../utils/constants';
import styles from './PropertyForm.module.css';

interface PropertyFormProps {
  onSubmit: (data: PropertyInput) => void;
  isLoading: boolean;
}

const EMPTY_FORM: PropertyInput = {
  listingUrl: '',
  streetAddress: '',
  city: '',
  state: 'GA',
  zip: '',
  price: '',
  beds: '',
  baths: '',
  squareFeet: '',
  lotSize: '',
  propertyType: 'Single Family',
  yearBuilt: '',
  neighborhood: '',
  keyFeatures: '',
  interiorFeatures: '',
  exteriorFeatures: '',
  schoolInfo: '',
  agentNotes: '',
  targetBuyerType: '',
  tone: 'Professional',
};

interface FieldError {
  [key: string]: string;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState<PropertyInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldError>({});

  const set = (field: keyof PropertyInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.price.trim()) newErrors.price = 'Price is required';
    if (!form.beds.trim()) newErrors.beds = 'Beds is required';
    if (!form.baths.trim()) newErrors.baths = 'Baths is required';
    if (!form.squareFeet.trim()) newErrors.squareFeet = 'Square feet is required';
    if (!form.keyFeatures.trim()) newErrors.keyFeatures = 'Key features are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const loadSample = () => {
    setForm(SAMPLE_PROPERTY);
    setErrors({});
  };

  const clearForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Property Details</h2>
        <div className={styles.formActions}>
          <Button type="button" variant="ghost" size="sm" onClick={clearForm}>
            Clear
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={loadSample}>
            ✨ Use Sample
          </Button>
        </div>
      </div>

      {/* Optional URL */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Listing URL (Optional)</h3>
        <p className={styles.sectionNote}>
          Paste a listing URL for reference. This does not auto-import data — please fill in the fields below.
        </p>
        <div className={styles.field}>
          <label className={styles.label}>Listing URL</label>
          <input
            type="url"
            className={styles.input}
            placeholder="https://www.zillow.com/homedetails/... (for reference only)"
            value={form.listingUrl}
            onChange={(e) => set('listingUrl', e.target.value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Property Location</h3>
        <div className={styles.field}>
          <label className={styles.label}>
            Street Address <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={`${styles.input} ${errors.streetAddress ? styles['input--error'] : ''}`}
            placeholder="123 Maple Street"
            value={form.streetAddress}
            onChange={(e) => set('streetAddress', e.target.value)}
          />
          {errors.streetAddress && <p className={styles.errorMsg}>{errors.streetAddress}</p>}
        </div>

        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label}>
              City <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.city ? styles['input--error'] : ''}`}
              placeholder="Atlanta"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
            />
            {errors.city && <p className={styles.errorMsg}>{errors.city}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              State <span className={styles.required}>*</span>
            </label>
            <select
              className={`${styles.select} ${errors.state ? styles['input--error'] : ''}`}
              value={form.state}
              onChange={(e) => set('state', e.target.value)}
            >
              {STATE_ABBREVIATIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.state && <p className={styles.errorMsg}>{errors.state}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>ZIP Code</label>
            <input
              type="text"
              className={styles.input}
              placeholder="30305"
              maxLength={10}
              value={form.zip}
              onChange={(e) => set('zip', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Neighborhood</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Buckhead, Midtown..."
              value={form.neighborhood}
              onChange={(e) => set('neighborhood', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Property Details</h3>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>
              List Price <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputGroup}>
              <span className={styles.inputPrefix}>$</span>
              <input
                type="text"
                className={`${styles.input} ${styles['input--prefixed']} ${errors.price ? styles['input--error'] : ''}`}
                placeholder="1,250,000"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </div>
            {errors.price && <p className={styles.errorMsg}>{errors.price}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Property Type</label>
            <select
              className={styles.select}
              value={form.propertyType}
              onChange={(e) => set('propertyType', e.target.value as PropertyType)}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row4}>
          <div className={styles.field}>
            <label className={styles.label}>
              Beds <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.beds ? styles['input--error'] : ''}`}
              placeholder="4"
              value={form.beds}
              onChange={(e) => set('beds', e.target.value)}
            />
            {errors.beds && <p className={styles.errorMsg}>{errors.beds}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Baths <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.baths ? styles['input--error'] : ''}`}
              placeholder="3.5"
              value={form.baths}
              onChange={(e) => set('baths', e.target.value)}
            />
            {errors.baths && <p className={styles.errorMsg}>{errors.baths}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Sq Ft <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.squareFeet ? styles['input--error'] : ''}`}
              placeholder="3,200"
              value={form.squareFeet}
              onChange={(e) => set('squareFeet', e.target.value)}
            />
            {errors.squareFeet && <p className={styles.errorMsg}>{errors.squareFeet}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Year Built</label>
            <input
              type="text"
              className={styles.input}
              placeholder="2018"
              maxLength={4}
              value={form.yearBuilt}
              onChange={(e) => set('yearBuilt', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Lot Size</label>
          <input
            type="text"
            className={styles.input}
            placeholder="0.35 acres"
            value={form.lotSize}
            onChange={(e) => set('lotSize', e.target.value)}
          />
        </div>
      </div>

      {/* Features */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Features & Highlights</h3>
        <div className={styles.field}>
          <label className={styles.label}>
            Key Features <span className={styles.required}>*</span>
          </label>
          <textarea
            className={`${styles.textarea} ${errors.keyFeatures ? styles['input--error'] : ''}`}
            placeholder="Chef's kitchen, open floor plan, primary suite with spa bath, 3-car garage, heated pool..."
            rows={3}
            value={form.keyFeatures}
            onChange={(e) => set('keyFeatures', e.target.value)}
          />
          {errors.keyFeatures && <p className={styles.errorMsg}>{errors.keyFeatures}</p>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Interior Features</label>
          <textarea
            className={styles.textarea}
            placeholder="Hardwood floors, 10-ft ceilings, custom built-ins, gas fireplace..."
            rows={2}
            value={form.interiorFeatures}
            onChange={(e) => set('interiorFeatures', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Exterior Features</label>
          <textarea
            className={styles.textarea}
            placeholder="Covered patio, professional landscaping, fenced yard, irrigation system..."
            rows={2}
            value={form.exteriorFeatures}
            onChange={(e) => set('exteriorFeatures', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>School Information</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Smith Elementary, Jones Middle, Central High School"
            value={form.schoolInfo}
            onChange={(e) => set('schoolInfo', e.target.value)}
          />
          <p className={styles.fieldNote}>Include only verified school names. AI will not invent school ratings.</p>
        </div>
      </div>

      {/* Marketing */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Marketing & Tone</h3>
        <div className={styles.field}>
          <label className={styles.label}>Agent Notes / Selling Points</label>
          <textarea
            className={styles.textarea}
            placeholder="Sellers are motivated. One-year home warranty included. Move-in ready..."
            rows={2}
            value={form.agentNotes}
            onChange={(e) => set('agentNotes', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Target Buyer Type</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Executive family, first-time buyer, luxury move-up buyer..."
            value={form.targetBuyerType}
            onChange={(e) => set('targetBuyerType', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Content Tone</label>
          <div className={styles.toneGrid}>
            {TONE_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`${styles.toneOption} ${form.tone === t.value ? styles['toneOption--active'] : ''}`}
                onClick={() => set('tone', t.value as ToneType)}
              >
                <span className={styles.toneLabel}>{t.label}</span>
                <span className={styles.toneDesc}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.submitSection}>
        <Button
          type="submit"
          variant="accent"
          size="lg"
          isLoading={isLoading}
          fullWidth
        >
          {isLoading ? 'Generating Copy...' : '✦ Generate Marketing Copy'}
        </Button>
        <p className={styles.disclaimer}>
          AI-generated content should be reviewed for accuracy and MLS compliance before publishing.
        </p>
      </div>
    </form>
  );
};
