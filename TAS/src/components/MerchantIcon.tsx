import React from 'react';
import './MerchantIcon.css';

interface MerchantIconProps {
  initial: string;
  background: string;
  color: string;
}

// NOTE: real merchant logos (Amazon, Netflix, Spotify, etc.) are trademarked.
// This renders a generic colored initial square as a stand-in — swap in
// each merchant's officially licensed logo asset before shipping.
export function MerchantIcon({ initial, background, color }: MerchantIconProps) {
  return (
    <div className="merchant-icon" style={{ background, color }}>
      {initial}
    </div>
  );
}