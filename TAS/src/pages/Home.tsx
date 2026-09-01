import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardComponent } from '../components/CardComponent';
import { MerchantList } from '../components/MerchantList';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { sampleMerchants } from '../data/merchants';
import '../theme/theme.css';
import './Home.css';

const STORAGE_KEY = 'selected-merchants';

export function HomePage() {
  const navigate = useNavigate();
  const [selectedTurs, setSelectedTurs] = useState<Set<string>>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return new Set(sampleMerchants.map((m) => m.tur));
    }

    try {
      const parsed = JSON.parse(saved) as string[];
      return new Set(parsed);
    } catch {
      return new Set(sampleMerchants.map((m) => m.tur));
    }
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(selectedTurs)));
  }, [selectedTurs]);

  useEffect(() => {
    const triggerSessionFlow = async () => {
      try {
        await fetch('/session/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ consentLink: 'demo-link' }),
        });

        await fetch('/merchants', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
      } catch (error) {
        console.info('Demo endpoint request recorded in Network tab:', error);
      }
    };

    void triggerSessionFlow();
  }, []);

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
      await fetch('/consent/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedTurs: Array.from(selectedTurs) }),
      });

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
        {submitting ? 'Submitting…' : 'Submit'}
      </PrimaryButton>
      <SecondaryButton onClick={() => window.history.back()}>Cancel</SecondaryButton>
    </div>
  );
}