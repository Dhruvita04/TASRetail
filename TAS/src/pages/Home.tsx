import React, { useState } from 'react';
import { CardComponent } from '../components/CardComponent';
import { MerchantList } from '../components/MerchantList';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { sampleMerchants } from '../data/merchants';
import '../theme/theme.css';
import './Home.css';

export function HomePage() {
  const [selectedTurs, setSelectedTurs] = useState<Set<string>>(
    new Set(sampleMerchants.map((m) => m.tur)) // all selected by default, matches reference
  );
  const [submitting, setSubmitting] = useState(false);

  function handleToggle(tur: string) {
    setSelectedTurs((prev) => {
      const next = new Set(prev);
      next.has(tur) ? next.delete(tur) : next.add(tur);
      return next;
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    // POST /consent/initiate with Array.from(selectedTurs) goes here,
    // then navigate to the /acs authentication route on success.
  }

  return (
    <div className="home-page">
      <h1 className="home-page__title">Map your new card</h1>
      <p className="home-page__subtitle">
        Select the merchants where you want to update your new card.
      </p>

      <CardComponent maskedNumber="4321" status="Active" />

      <h2 className="home-page__section-label">Your saved merchants</h2>
      <MerchantList
        merchants={sampleMerchants}
        selectedTurs={selectedTurs}
        onToggle={handleToggle}
      />

      <PrimaryButton onClick={handleSubmit} disabled={submitting || selectedTurs.size === 0}>
        {submitting ? 'Submitting…' : 'Submit'}
      </PrimaryButton>
      <SecondaryButton onClick={() => window.history.back()}>Cancel</SecondaryButton>
    </div>
  );
}