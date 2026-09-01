import React from 'react';
import { MerchantCard, type Merchant } from './MerchantCard';
import './MerchantList.css';

interface MerchantListProps {
  merchants: Merchant[];
  selectedTurs: Set<string>;
  onToggle: (tur: string) => void;
}

export function MerchantList({ merchants, selectedTurs, onToggle }: MerchantListProps) {
  return (
    <div className="merchant-list">
      {merchants.map((merchant) => (
        <MerchantCard
          key={merchant.tur}
          merchant={merchant}
          checked={selectedTurs.has(merchant.tur)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}