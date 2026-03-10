import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import type { PropertyInput } from '../types';
import styles from './PropertyForm.module.css';

const EMPTY_FORM: PropertyInput = {
  listingUrl: '',
  streetAddress: '',
  city: '',
  state: '',
  zip: '',
  price: '',
  beds: '',
  baths: '',
  sqft: '',
  lotSize: '',
  propertyType: 'Single Family',
  yearBuilt: '',
  neighborhood: '',
  keyFeatures: '',
  interiorFeatures: '',
  exteriorFeatures: '',
  schoolInfo: '',
  agentNotes: '',
  targetBuyer: 'First-Time Buyers',
  tone: 'Professional',
};

interface PropertyFormProps {
  onSubmit: (data: PropertyInput) => void;
  onLoadSample: () => void;
  isLoading: boolean;
  sampleData?: PropertyInput | null;
}

export default function PropertyForm({
  onSubmit,
  onLoadSample,
  isLoading,
  sampleData,
}: PropertyFormProps) {
  const [form, setForm] = useState<PropertyInput>(EMPTY_FORM);

  useEffect(() => {
    if (sampleData) setForm(sampleData);
  }, [sampleData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleReset = () => setForm(EMPTY_FORM);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Property Details</h2>
        <button
          type="button"
          className={styles.sampleBtn}
          onClick={onLoadSample}
          disabled={isLoading}
        >
          Load Sample
        </button>
      </div>

      {/* Listing URL */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="listingUrl">Listing URL <span className={styles.optional}>(optional)</span></label>
        <input
          id="listingUrl"
          name="listingUrl"
          type="url"
          className={styles.input}
          placeholder="https://www.zillow.com/homedetails/..."
          value={form.listingUrl}
          onChange={handleChange}
        />
      </div>

      {/* Address block */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Address</legend>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="streetAddress">Street Address <span className={styles.required}>*</span></label>
          <input
            id="streetAddress"
            name="streetAddress"
            type="text"
            className={styles.input}
            placeholder="123 Maple Street"
            value={form.streetAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="city">City <span className={styles.required}>*</span></label>
            <input
              id="city"
              name="city"
              type="text"
              className={styles.input}
              placeholder="Tucker"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="state">State <span className={styles.required}>*</span></label>
            <input
              id="state"
              name="state"
              type="text"
              className={styles.input}
              placeholder="GA"
              maxLength={2}
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="zip">ZIP <span className={styles.required}>*</span></label>
            <input
              id="zip"
              name="zip"
              type="text"
              className={styles.input}
              placeholder="30084"
              value={form.zip}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </fieldset>

      {/* Core Stats */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Listing Details</legend>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="price">Price <span className={styles.required}>*</span></label>
            <input
              id="price"
              name="price"
              type="text"
              className={styles.input}
              placeholder="$724,900"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="propertyType">Property Type <span className={styles.required}>*</span></label>
            <select
              id="propertyType"
              name="propertyType"
              className={styles.select}
              value={form.propertyType}
              onChange={handleChange}
              required
            >
              <option>Single Family</option>
              <option>Condo</option>
              <option>Townhouse</option>
              <option>Multi-Family</option>
              <option>Land</option>
              <option>Commercial</option>
            </select>
          </div>
        </div>
        <div className={styles.row4}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="beds">Beds <span className={styles.required}>*</span></label>
            <input
              id="beds"
              name="beds"
              type="text"
              className={styles.input}
              placeholder="4"
              value={form.beds}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="baths">Baths <span className={styles.required}>*</span></label>
            <input
              id="baths"
              name="baths"
              type="text"
              className={styles.input}
              placeholder="3.5"
              value={form.baths}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="sqft">Sq Ft <span className={styles.required}>*</span></label>
            <input
              id="sqft"
              name="sqft"
              type="text"
              className={styles.input}
              placeholder="3,200"
              value={form.sqft}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lotSize">Lot Size <span className={styles.optional}>(opt.)</span></label>
            <input
              id="lotSize"
              name="lotSize"
              type="text"
              className={styles.input}
              placeholder="0.45 acres"
              value={form.lotSize}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="yearBuilt">Year Built <span className={styles.optional}>(optional)</span></label>
            <input
              id="yearBuilt"
              name="yearBuilt"
              type="text"
              className={styles.input}
              placeholder="2019"
              value={form.yearBuilt}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="neighborhood">Neighborhood <span className={styles.optional}>(optional)</span></label>
            <input
              id="neighborhood"
              name="neighborhood"
              type="text"
              className={styles.input}
              placeholder="Whisperwood Estates"
              value={form.neighborhood}
              onChange={handleChange}
            />
          </div>
        </div>
      </fieldset>

      {/* Features */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Features & Details</legend>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="keyFeatures">Key Features</label>
          <textarea
            id="keyFeatures"
            name="keyFeatures"
            className={styles.textarea}
            placeholder="Smart home, three-car garage, finished basement..."
            value={form.keyFeatures}
            onChange={handleChange}
            rows={2}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="interiorFeatures">Interior Features</label>
          <textarea
            id="interiorFeatures"
            name="interiorFeatures"
            className={styles.textarea}
            placeholder="Quartz countertops, hardwood floors, chef's kitchen..."
            value={form.interiorFeatures}
            onChange={handleChange}
            rows={2}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="exteriorFeatures">Exterior Features</label>
          <textarea
            id="exteriorFeatures"
            name="exteriorFeatures"
            className={styles.textarea}
            placeholder="Professional landscaping, covered porch, fire pit..."
            value={form.exteriorFeatures}
            onChange={handleChange}
            rows={2}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="schoolInfo">School Information</label>
          <textarea
            id="schoolInfo"
            name="schoolInfo"
            className={styles.textarea}
            placeholder="Tucker High School cluster, top-rated elementary..."
            value={form.schoolInfo}
            onChange={handleChange}
            rows={2}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="agentNotes">Agent Notes / Selling Points</label>
          <textarea
            id="agentNotes"
            name="agentNotes"
            className={styles.textarea}
            placeholder="Motivated sellers, priced below appraisal, quick close possible..."
            value={form.agentNotes}
            onChange={handleChange}
            rows={2}
          />
        </div>
      </fieldset>

      {/* Targeting */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Marketing Preferences</legend>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="targetBuyer">Target Buyer</label>
            <select
              id="targetBuyer"
              name="targetBuyer"
              className={styles.select}
              value={form.targetBuyer}
              onChange={handleChange}
            >
              <option>First-Time Buyers</option>
              <option>Move-Up Buyers</option>
              <option>Luxury Buyers</option>
              <option>Investors</option>
              <option>Downsizers</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tone">Tone <span className={styles.required}>*</span></label>
            <select
              id="tone"
              name="tone"
              className={styles.select}
              value={form.tone}
              onChange={handleChange}
              required
            >
              <option>Professional</option>
              <option>Luxury</option>
              <option>Friendly</option>
              <option>High-Energy</option>
            </select>
          </div>
        </div>
      </fieldset>

      <div className={styles.actions}>
        <button type="button" className={styles.resetBtn} onClick={handleReset} disabled={isLoading}>
          Clear
        </button>
        <button type="submit" className={styles.generateBtn} disabled={isLoading}>
          {isLoading ? (
            <span className={styles.loadingDots}>Generating<span>...</span></span>
          ) : (
            '⚡ Generate Content'
          )}
        </button>
      </div>
    </form>
  );
}
