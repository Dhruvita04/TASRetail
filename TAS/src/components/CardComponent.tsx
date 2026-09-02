import { StatusBadge } from './StatusBadge';
import './CardComponent.css';

interface CardComponentProps {
  maskedNumber: string;   // e.g. "4321" — last 4 digits only
  status?: 'Active' | 'Inactive';
}

export function CardComponent({ maskedNumber, status = 'Active' }: CardComponentProps) {
  return (
    <div className="card-component">
      <div className="card-component__icon" aria-hidden="true">
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <rect x="0.5" y="0.5" width="21" height="15" rx="2.5" stroke="currentColor" />
          <rect x="0.5" y="4" width="21" height="3" fill="currentColor" />
        </svg>
      </div>
      <div className="card-component__details">
        <span className="card-component__label">New Card</span>
        <span className="card-component__number">•••• •••• •••• {maskedNumber}</span>
      </div>
      <StatusBadge label={status} tone={status === 'Active' ? 'success' : 'neutral'} />
    </div>
  );
}