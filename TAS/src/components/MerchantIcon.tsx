import React, { useState } from 'react';
import './MerchantIcon.css';

interface MerchantIconProps {
  logoUrl?: string;      // real merchant logo, if available
  initial: string;       // fallback letter
  background: string;    // fallback background color
  color: string;         // fallback letter color
  alt: string;
}

// Renders the real logo when a URL is provided and loads successfully.
// Falls back to a colored initial square if logoUrl is missing, still
// loading, or fails to load — so a broken/unlicensed asset never breaks
// the row.
export function MerchantIcon({ logoUrl, initial, background, color, alt }: MerchantIconProps) {
  const [failed, setFailed] = useState(false);

  if (logoUrl && !failed) {
    return (
      <div className="merchant-icon merchant-icon--logo">
        <img
          src={logoUrl}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="merchant-icon" style={{ background, color }}>
      {initial}
    </div>
  );
}