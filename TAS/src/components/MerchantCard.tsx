import { MerchantIcon } from './MerchantIcon';
import './MerchantCard.css';

export interface Merchant {
  tur: string;           // Token Unique Reference — identifies this token
  name: string;
  category: string;
  logoUrl?: string;      // real logo — falls back to initial square if absent
  iconInitial: string;
  iconBackground: string;
  iconColor: string;
}

interface MerchantCardProps {
  merchant: Merchant;
  checked?: boolean;
  onToggle?: (tur: string) => void;
  showCheckbox?: boolean;
  statusLabel?: string;
  statusTone?: 'success' | 'danger';
}

export function MerchantCard({
  merchant,
  checked = false,
  onToggle,
  showCheckbox = true,
  statusLabel,
  statusTone,
}: MerchantCardProps) {
  const content = (
    <>
      <MerchantIcon
        logoUrl={merchant.logoUrl}
        initial={merchant.iconInitial}
        background={merchant.iconBackground}
        color={merchant.iconColor}
        alt={`${merchant.name} logo`}
      />
      <div className="merchant-card__text">
        <span className="merchant-card__name">{merchant.name}</span>
        <span className="merchant-card__category">{merchant.category}</span>
      </div>
      {showCheckbox && onToggle ? (
        <>
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
        </>
      ) : null}
      {statusLabel ? (
        <span className={`merchant-card__status merchant-card__status--${statusTone ?? 'success'}`}>
          {statusLabel}
        </span>
      ) : null}
    </>
  );

  if (showCheckbox && onToggle) {
    return <label className="merchant-card">{content}</label>;
  }

  return <div className="merchant-card merchant-card--result">{content}</div>;
}