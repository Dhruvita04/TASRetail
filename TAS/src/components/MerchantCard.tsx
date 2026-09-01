import React from 'react';
import { MerchantIcon } from './MerchantIcon';
import './MerchantCard.css';

export interface Merchant {
  tur: string;           // Token Unique Reference — identifies this token
  name: string;
  category: string;
  iconInitial: string;
  iconBackground: string;
  iconColor: string;
}

interface MerchantCardProps {
  merchant: Merchant;
  checked: boolean;
  onToggle: (tur: string) => void;
}

export function MerchantCard({ merchant, checked, onToggle }: MerchantCardProps) {
  return (
    <label className="merchant-card">
      <MerchantIcon
        initial={merchant.iconInitial}
        background={merchant.iconBackground}
        color={merchant.iconColor}
      />
      <div className="merchant-card__text">
        <span className="merchant-card__name">{merchant.name}</span>
        <span className="merchant-card__category">{merchant.category}</span>
      </div>
      <input
        type="checkbox"
        className="merchant-card__checkbox-input"
        checked={checked}
        onChange={() => onToggle(merchant.tur)}
        aria-label={`Select ${merchant.name} for card mapping`}
      />
      <span className="merchant-card__checkbox-box" aria-hidden="true">
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
          <path d="M1 4.5L4.2 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}