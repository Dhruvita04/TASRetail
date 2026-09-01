import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardComponent } from '../components/CardComponent';
import { MerchantList } from '../components/MerchantList';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { sampleMerchants } from '../data/merchants';
import '../theme/theme.css';
import './Home.css';

export function HomePage() {
  const navigate = useNavigate();
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
    try {
      // POST /consent/initiate with Array.from(selectedTurs) goes here
      console.log('Submitting TURs:', Array.from(selectedTurs));
      // await api.initiateConsent(Array.from(selectedTurs));
      
      // On success, navigate to the authentication page
      navigate('/acs');
    } catch (error) {
      console.error('Submit failed:', error);
      setSubmitting(false);
    }
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
        {submitting ? 'Submitting…' : 'Submit' }
      </PrimaryButton>
      <SecondaryButton onClick={() => window.history.back()}>Cancel</SecondaryButton>
    </div>
  );
}