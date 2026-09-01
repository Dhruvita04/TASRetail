import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardComponent } from '../components/CardComponent';
import { MerchantCard } from '../components/MerchantCard';
import { sampleMerchants } from '../data/merchants';
import '../theme/theme.css';
import './Result.css';

const STORAGE_KEY = 'selected-merchants';

function getSelectedMerchants() {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return new Set(sampleMerchants.map((merchant) => merchant.tur));
  }

  try {
    const parsed = JSON.parse(saved) as string[];
    return new Set(parsed);
  } catch {
    return new Set(sampleMerchants.map((merchant) => merchant.tur));
  }
}

export function ResultPage() {
  const navigate = useNavigate();
  const selectedTurs = getSelectedMerchants();

  useEffect(() => {
    const pollStatus = async () => {
      try {
        await fetch('/status', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
      } catch (error) {
        console.info('Status polling request recorded in Network tab:', error);
      }
    };

    void pollStatus();
  }, []);

  const mappedMerchants = sampleMerchants.filter((merchant) => selectedTurs.has(merchant.tur));
  const notMappedMerchants = sampleMerchants.filter((merchant) => !selectedTurs.has(merchant.tur));

  return (
    <div className="result-page">
      <div className="result-page__shell">
        <CardComponent maskedNumber="4321" status="Active" />

        <div className="result-page__success-banner" role="status" aria-live="polite">
          <div className="result-page__success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.5 12.2 10.1 15.8 17.7 8.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="result-page__success-text">Mapping Successful!</div>
        </div>

        <div className="result-page__content">
          <div className="result-page__subheading">Mapped Successfully ({mappedMerchants.length})</div>
          <div className="result-page__list">
            {mappedMerchants.map((merchant) => (
              <MerchantCard
                key={merchant.tur}
                merchant={merchant}
                showCheckbox={false}
                statusLabel="Mapped"
                statusTone="success"
              />
            ))}
          </div>

          <div className="result-page__subheading danger">Not Mapped ({notMappedMerchants.length})</div>
          <div className="result-page__list">
            {notMappedMerchants.map((merchant) => (
              <MerchantCard
                key={merchant.tur}
                merchant={merchant}
                showCheckbox={false}
                statusLabel="Not Mapped"
                statusTone="danger"
              />
            ))}
          </div>
        </div>

        <div className="result-page__actions">
          <button type="button" className="result-page__secondary" onClick={() => navigate('/home')}>
            Go to Dashboard
          </button>
          <button type="button" className="result-page__primary" onClick={() => navigate('/home')}>
            Done
          </button>
        </div>

        <div className="result-page__footer" aria-label="Security status">
          <span className="result-page__security-item">Secure</span>
          <span className="result-page__security-item">Trusted</span>
          <span className="result-page__security-item">Seamless</span>
        </div>
      </div>
    </div>
  );
}
