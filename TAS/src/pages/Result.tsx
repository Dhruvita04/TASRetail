import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleMerchants } from '../data/merchants';
import '../theme/theme.css';
import './Result.css';

const mappedMerchants = sampleMerchants.slice(0, 2);
const notMappedMerchants = sampleMerchants.slice(2);

export function ResultPage() {
  const navigate = useNavigate();

  return (
    <div className="result-page">
      <div className="result-page__shell">
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
              <div key={merchant.tur} className="result-page__row">
                <div className="result-page__merchant" aria-label={`${merchant.name} mapped`}>
                  <div
                    className="result-page__merchant-icon"
                    style={{ background: merchant.iconBackground, color: merchant.iconColor }}
                  >
                    {merchant.iconInitial}
                  </div>
                  <span>{merchant.name}</span>
                </div>
                <span className="result-page__status success">Mapped</span>
              </div>
            ))}
          </div>

          <div className="result-page__subheading danger">Not Mapped ({notMappedMerchants.length})</div>
          <div className="result-page__list">
            {notMappedMerchants.map((merchant) => (
              <div key={merchant.tur} className="result-page__row">
                <div className="result-page__merchant" aria-label={`${merchant.name} not mapped`}>
                  <div
                    className="result-page__merchant-icon"
                    style={{ background: merchant.iconBackground, color: merchant.iconColor }}
                  >
                    {merchant.iconInitial}
                  </div>
                  <span>{merchant.name}</span>
                </div>
                <span className="result-page__status danger">Not Mapped</span>
              </div>
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
