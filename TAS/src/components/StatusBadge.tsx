import React from 'react';
import './StatusBadge.css';

interface StatusBadgeProps {
  label: string;
  tone?: 'success' | 'neutral';
}

export function StatusBadge({ label, tone = 'success' }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}